var express = require('express'),
    //_ = require('lodash'),
	bodyParser = require('body-parser'),
    app = express(),
	moment = require('moment'),
    Waterline = require('waterline');



// Instantiate a new instance of the ORM
var orm = new Waterline();


//////////////////////////////////////////////////////////////////
// WATERLINE CONFIG
//////////////////////////////////////////////////////////////////

// Require any waterline compatible adapters here
//var diskAdapter = require('sails-disk'),
var mysqlAdapter = require('sails-mysql');


// Build A Config Object
var config = {

	// Setup Adapters
	// Creates named adapters that have have been required
	adapters: {
		'default': mysqlAdapter,
		mysql: mysqlAdapter
	},

	// Build Connections Config
	// Setup connections using the named adapter configs
	connections: {
		
		mysqlos: {
			adapter	  : 'mysql',
			module    : 'sails-mysql',
			host      : process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
			port      : process.env.OPENSHIFT_MYSQL_DB_PORT || 3306,
			user      : process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'admin',
			password  : process.env.OPENSHIFT_MYSQL_DB_PASSWORD ||'admin',
			database  : 'lms'
		}
		
	},

	defaults: {
		migrate: 'alter'
	}

};


//////////////////////////////////////////////////////////////////
// WATERLINE MODELS
//////////////////////////////////////////////////////////////////

var User = Waterline.Collection.extend({

  identity: 'user',
  connection: 'mysqlos',

  attributes: {
    name: 'string',
    password: 'string',
	role: 'integer',		// 1 for manager, 2 for user
	manager_id: 'integer'	// manager responsible for user. model.id of manager user.
  }
  
});

var Holidays = Waterline.Collection.extend({

  identity: 'holiday',
  connection: 'mysqlos',

  attributes: {
	date: 'datetime',
	occasion: 'string'
  }
  
});

var Leave = Waterline.Collection.extend({

	identity: 'leave',
	connection: 'mysqlos',

	attributes: {
		start: {
			type: 'datetime',
			required: true,
		},
		end: {
			type: 'datetime',
			required: true,
		},
		user_id: 'integer',
		manager_id: 'integer',
		status: 'integer',
		comment: 'string'
	},
	
	getLength: function() {
		// Do something here
	},
	
	getActualLength: function() {
		// Do something here
	}
});


// Load the Models into the ORM
orm.loadCollection(User);
orm.loadCollection(Leave);
orm.loadCollection(Holidays);


//////////////////////////////////////////////////////////////////
// EXPRESS SETUP
//////////////////////////////////////////////////////////////////


// Setup Express Application
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());								// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({	extended: true }));		// to support URL-encoded bodies
app.use(function(req, res, next) {
    if (req.url.toString() !== "/status/") {
        console.log(req.url);
        console.log(req.body);
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//app.use(express.methodOverride());


app.get('/api/holidays/', function(req, res) {
	app.models.holiday.find().exec(function(err, models) {
		if(err) return res.json({ err: err }, 500);
		console.log(models);
		
		for(var i in models ){
			console.log(new Date(models[i].date).getDay());
		}
		
		res.json(models);
	});
});


app.post('/api/signin/', function(req, res) {
	app.models.user.findOne({ name: req.body.user.name, password: req.body.user.password }).exec(function(err, model) {
		if(err) return res.json({ status: false, err: err }, 500);
		res.json({ status: true, role: model.role });
	});
});


app.post('/api/leave/new/', function(req, res) {
	app.models.user.findOne({ name: req.body.user.name, password: req.body.user.password }).exec(function(err, model) {
		if(err) return res.json({ err: err }, 500);
		
		req.body.leave.user_id = model.id;
		req.body.leave.manager_id = model.manager_id;
		
		app.models.leave.create(req.body.leave,function(err, model) {
			if(err) return res.json({ err: err }, 500);
			res.json(model);
		});
	});
});


app.post('/api/leave/get/', function(req, res) {
	app.models.user.findOne({ name: req.body.user.name, password: req.body.user.password }).exec(function(err, model) {
		if(err) return res.json({ err: err }, 500);
		
		app.models.leave.find({ user_id: model.id },function(err, model) {
			if(err) return res.json({ err: err }, 500);
			res.json(model);
		});
	});
});


app.post('/api/admin/leave/get/', function(req, res) {
	app.models.user.findOne({ name: req.body.user.name, password: req.body.user.password }).exec(function(err, model) {
		if(err) return res.json({ err: err }, 500);
		
		app.models.leave.find({ manager_id: model.id },function(err, model) {
			if(err) return res.json({ err: err }, 500);
			res.json(model);
		});
	});
});


app.post('/api/admin/leave/set/', function(req, res) {
	app.models.user.findOne({ name: req.body.user.name, password: req.body.user.password }).exec(function(err, model) {
		if(err) return res.json({ err: err }, 500);
		
		app.models.leave.findOne({ id: req.body.leave.id, manager_id: model.id },function(err, model) {
			if(err) return res.json({ err: err }, 500);
			res.json(model);
		});
	});
});











app.post('/holidays/', function(req, res) {
	var h = req.body.h;
	console.log(Array.isArray(h));
	
	var result = new Array();
	for(var i in h) {
		/*
		var x = { date: new Date(h[i]) };
		console.log(i,x);
		*/
		//var tmp = new Date( Date.UTC(h[i].toString()) );
		
		h[i] = new Date(h[i]);
		
		//var x = { date: new Date(h[i].toUTCString()) };
		
		console.log(i,x.date.toUTCString());
		
		
		result.push(x);
		//var tmp2 = Date.UTC(x.toUTCString());
		//result.push(tmp2);
		
		
		app.models.holiday.create({ date: h[i] },function(err, model) {
		if(err) return console.log(err);
			console.log(model);
		});
	}
	res.json(result);
});




app.get('/timetest/', function(req, res) {
	var x = new Date();
	res.json(x);
});



app.get('/users/:id', function(req, res) {
  app.models.user.findOne({ id: req.params.id }, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});

app.put('/users/:id', function(req, res) {
  // Don't pass ID to update
  delete req.body.id;

  app.models.user.update({ id: req.params.id }, req.body, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});



//////////////////////////////////////////////////////////////////
// START WATERLINE
//////////////////////////////////////////////////////////////////

// Start Waterline passing adapters in
orm.initialize(config, function(err, models) {
	if(err) throw err;

	app.models = models.collections;
	app.connections = models.connections;

	// Start Server

	//set up application enviornment
	var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
	var ipaddress = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1';
	app.listen(port, ipaddress);
  
	//app.listen(3000);
});

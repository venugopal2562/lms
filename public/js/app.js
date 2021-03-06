var app;

$(document).ready(function() {
	//initApp();
	app = new App();
	
	app.lmsServer.getHolidays(function(result){
		app.hdays = result;
		console.log(app.hdays);
		app.view.initDatePicker('-4d','31/12/2015', app.hdays, app.createLeave);
	});

	
}); 


function App() {
	
	this.lmsServer = new initLmsServer(window.location.origin);
	this.view = new View();
	this.view.show(this.view.pages[0]);
	this.user = new User();
	
	if(this.user.readCookie()){
		this.lmsServer.login(this.user.toJSON(), this.cb_login);
	}
}


App.prototype = {
	
	constructor: App,	

	login: function() {
		app.user = new User($('#login-username').val(),$('#login-password').val());
		app.lmsServer.login(app.user.toJSON(), app.cb_login);
	},
	
	showUserProfile: function() {
		app.view.show(app.view.pages[3]);
		app.lmsServer.getLeaves(app.user.toJSON(), app.cb_getLeaves);
	},
	
	showAdminPage: function() {
		app.view.show(app.view.pages[4]);
		app.lmsServer.getLeavesAdmin(app.user.toJSON(), app.cb_getAdminLeaves);
	},
	
	cb_login: function (data) {
		console.log(data);
		console.log(this);
		
		app.user.id = data.id;
		
		switch(data.role){
			case 1: app.showUserProfile();
				break;
			case 2: app.showAdminPage();
				break;
			default: app.view.displayLoginError();
				break;
		}
		
		
	},
	
	createLeave: function(start,end){
		console.log(arguments);
		nleave = new Leave(start,end);
		console.log(nleave.getDetails(app.hdays));
		console.log(this);
		app.view.displayNewLeave(nleave.getDetails(app.hdays));
		
		app.nLeave = nleave;
	},
	
	cb_newLeave: function(data) {
		console.log("NEW LEAVE- ",data);
		if(data.status === 0 && data.user_id === app.user.id){
			app.nleave = null;
			app.view.initDatePicker('-4d','31/12/2015', app.hdays, app.createLeave);
			app.showUserProfile();
		}
	},	
	
	cb_getLeaves: function(data) {
		console.log("GOT LEAVES- ",data);
		app.view.displayLeaves(data);
	},
	
	cb_getAdminLeaves: function(data) {
		console.log("GOT ADMIN LEAVES- ",data);
		app.view.displayAdminLeaves(data);
	},
	
	confirmLeave: function(data){
		if(app.nLeave.getDetails(app.hdays).length < 16){
			app.lmsServer.newLeave(app.user.toJSON(), app.nLeave, app.cb_newLeave);
		}		
	},
	
	setLeaveAdmin: function(_id,_status){
		var _comment = '';
		if(_status === 2){
			_comment = $('#rejection_box').val();
		}
		app.lmsServer.setLeaveAdmin(app.user.toJSON(), { id : _id, status: _status, comment: _comment }, app.showAdminPage);
	}


}
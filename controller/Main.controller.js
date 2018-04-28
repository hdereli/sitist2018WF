sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller,MessageToast) {
	"use strict";

	return Controller.extend("com.huseyindereli.wfapp.controller.Main", {

		oRouter : {},

		onInit : function(){
		
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
		},

		onRegisterPress : function () {

			var oRegInfo = {};

			var _this = this;

			oRegInfo.userid = this.getView().byId('userid').getValue();
			oRegInfo.name = this.getView().byId('name').getValue();
			oRegInfo.surname = this.getView().byId('surname').getValue();

			$.ajax({
				header: {
					"Content-type": "application/json"
				},
				type: "POST",
				url: "https://sitistp232844trial.hanatrial.ondemand.com/sit/webservice/register.xsjs",
				data: JSON.stringify(oRegInfo),
				success: function(oSuccess) {

					MessageToast.show("Registration Done");

					_this._startWorkflow( oRegInfo , _this );
				},
				error: function(oError) {

					MessageToast.show("Registration ERROR");

				}
			});



		},


		_startWorkflow : function( info , _this ) {

			var token;
			$.ajax({
				url: "https://bpmworkflowruntimewfs-p232844trial.hanatrial.ondemand.com/workflow-service/rest/v1/xsrf-token",
				method: "GET",
				async: false,
				headers: {
					"X-CSRF-Token": "Fetch",
					"Authorization" : "Basic cDIzMjg0NDpIZDEyM3NjbiE="
				},
				success: function(result, xhr, data) {
					
					token = data.getResponseHeader("X-CSRF-Token");
					_this._startInstance( info, token );

				}
			});
		

		},

		_startInstance: function(info, token) {


			$.ajax({
				url: "https://bpmworkflowruntimewfs-p232844trial.hanatrial.ondemand.com/workflow-service/rest/v1/workflow-instances",
				method: "POST",
				async: false,
				contentType: "application/json",
				headers: {
					"X-CSRF-Token": token,
					"Authorization" : "Basic cDIzMjg0NDpIZDEyM3NjbiE=",
					"Content-Type" : "application/json"
				},
				data: JSON.stringify({
					definitionId: "sit",
					context: info
				}),
				success: function(result, xhr, data) {
					MessageToast.show("Workflow started");
				}
			});
		},
		
		
		onTasksPress : function(oEvent){

			this.oRouter.navTo("tasks");

		}


	});
});
odoo.define('beauty_clinic_management.widgets', function(require) {
"use strict";
var core = require('web.core');
var Dialog = require('web.Dialog');
var _t = core._t;
var QWeb = core.qweb;
var FormRenderer = require('web.FormRenderer');
var Dialog = require('web.Dialog');

FormRenderer.include({
	init: function (parent, state, params) {
		this._super(parent, state, params);
		var self = this;
		if (self.state.model === 'medical.patient' && state.data.medical_history){
		       var wizard = $(QWeb.render('dental', {'msg': state.data.medical_history}));
		       wizard.appendTo($('body')).modal({'keyboard': true});
            }
    },
});

});
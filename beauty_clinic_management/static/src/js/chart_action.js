odoo.define('beauty_clinic_management.chart_action', function(require) {
	"use strict";
	
	var core = require('web.core');
    var AbstractAction = require('web.AbstractAction');
	var Model = require('web.data');

	var part_name = '';

	var DentalChartView = AbstractAction.extend({
		template : "HumanBodyChartView",


		renderElement: function() {
			this._super()
			var self = this;

			console.log("_________________HumanBodyChartView__________________")

			self.$(".body_part").on("mouseenter", function(e) {
				console.log("________________ENTER___________________");
				console.log("-----------",self.$('#' + this.id).attr('name').split('_')[0])
				console.log("________________hbhjghjbghjb___________________",$("#part_selected"));

                e.preventDefault();
				part_name = self.$('#' + this.id).attr('name').split('_')[0];
                document.getElementById("part_selected").innerHTML = self.$('#' + this.id).attr('name').split('_')[0];
            });

			// new Model.DataSet(this, 'product.product').call('get_operation_names', ['product.product'],part_name).then(function(operation_list) {

			// });
			

		}
	});

	core.action_registry.add('human_body_chart', DentalChartView);
	return {
		DentalChartView : DentalChartView,
	};

});






odoo.define('beauty_clinic_management.ListRenderertree', function (require) {
    "use strict";
    
    var ListRenderer = require('web.ListRenderer');

    
    ListRenderer.include({
        

        _renderHeaderCell: function () {
            const $th = this._super.apply(this, arguments);
            if ($th[0].dataset.name == 'duration_name') {
                $th.removeClass('o_list_number_th');
            }
            return $th;
        },

    });
})
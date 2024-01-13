# -*- coding: utf-8 -*-
import json
import logging
import werkzeug.utils

from odoo import http
from odoo.http import request

class DentalSiteController(http.Controller):

    @http.route(['/get_patient_list'], type='json', auth="none", methods=['GET', 'POST'], csrf=False)
    def get_patient_list(self, **post):
        faf_ids = request.env['medical.patient'].sudo().search([])
        return faf_ids.read([])

    @http.route(['/get_duration_list'], type='json', auth="none", methods=['GET', 'POST'], csrf=False)
    def get_duration_list(self, **post):
        duration_ids = request.env['duration.duration'].sudo().search([])
        return duration_ids.read([])

    @http.route(['/get_patient_data'], type='json', auth="none", methods=['GET', 'POST'], csrf=False)
    def get_patient_data(self, **post):
        patient_id = request.env['medical.patient'].sudo().search([('id', '=', int(post.get('patient_id')))], limit=1)
        return patient_id.read([])

    @http.route(['/get_duration_data'], type='json', auth="none", methods=['GET', 'POST'], csrf=False)
    def get_duration_data(self, **post):
        duration_id = request.env['duration.duration'].sudo().search([('id', '=', int(post.get('duration_id')))], limit=1)
        return duration_id.read([])

    @http.route(['/get_appointment_data'], type='json', auth="none", methods=['GET', 'POST'], csrf=False)
    def get_appointment_data(self, **post):
        appointment_id = request.env['medical.appointment'].sudo().search([('name', '=', str(post.get('name')))], limit=1)
        return appointment_id.read([])

    @http.route(['/dental_management_perio_chart/web/<string:patient_id>'], type='http', auth='user')
    def a(self, debug=False, **k):
        patient_id = k['patient_id']
#         if not request.session.uid:
#             return http.local_redirect('/web/login?redirect=/hotel_room_dashboard/web')
 
#         return request.render('dental_management.dental_perio_chart')
        return request.render('dental_management.dental_perio_chart', {'patient_id':patient_id})
     
    @http.route(['/dental_management_chart/web/<string:ids>'], type='http', auth='user')
    def b(self, debug=False, **k):
        val_list = []
        val_list = k['ids'].split('_')
         
        patient_id = val_list[0]
        appt_id = ''
        if len(val_list) > 1:
            appt_id = val_list[1]
#         if not request.session.uid:
#             return http.local_redirect('/web/login?redirect=/hotel_room_dashboard/web')
        return request.render('dental_management.dental_chart', {'patient_id':patient_id,'appt_id':appt_id})

    

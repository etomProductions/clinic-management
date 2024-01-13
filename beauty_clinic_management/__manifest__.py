# -*- encoding: utf-8 -*-
{
    'name': 'Odoo Beauty Clinic Management',
    'version': '16.0.0.0',
    'category': 'Services',
    'author': 'Pragmatic TechSoft Pvt Ltd.',
    'website': 'http://pragtech.co.in',
    'depends': ['base', 'website', 'sale_management', 'purchase', 'account', 'product', 'account',
                'attachment_indexation', 'google_calendar', 'product_expiry', 'web', 'calendar'],
    'summary': 'The Beauty clinic module is very useful for admin and doctors to manage the patient details, appointments, face marks, body marks, treatment notes, utilized materials, generate prescriptions, invoicing and insurance management.',
    'description': """
This modules includes Beauty Clinic Management Features
<keywords>
Odoo - Beauty Clinic Management
Beauty
Beauty management app
Beauty management system
Beauty management module
Beauty management 
odoo Beauty
Beauty clinic management
Beauty app
""",
    "data": [
        'security/dental_security.xml',
        'security/ir.model.access.csv',
        'views/my_layout.xml',
        'data/dental_data.xml',
        'data/dose_units.xml',
        'data/medicament_form.xml',
        'data/snomed_frequencies.xml',
        'data/occupations.xml',
        'data/teeth_code.xml',
        'views/dental_view.xml',
        'wizard/wizard_actions.xml',
        'views/dental_sequences.xml',
        'report/income_by_procedure_qweb.xml',
        'report/patient_by_procedure_qweb.xml',
        'report/claim_report_qweb.xml',
        'report/claim_report_temp.xml',
        'report/income_by_insurance_company_qweb.xml',
        'views/dental_report.xml',
        'views/report_appointment.xml',
        'views/report_prescription.xml',
        'views/report_prescription_main.xml',
        # 'views/templates.xml',
        'views/report_patient_financing_agreement.xml',
        'views/report_income_by_procedure.xml',
        'views/report_patient_by_procedure.xml',
        'views/report_income_by_insurance_company.xml',
        'report/report_claim_form.xml',
        'report/report_daman_reimbursement.xml',
        'report/report_oman_reinburstment.xml',
        'report/report_nextcare_reimbursement.xml',
        'views/stock_alert.xml',
        'views/alert_data.xml',
        'views/financing_view.xml',
        'views/dental_invoice_view.xml',
        'report/report_income_by_doctor.xml',
        'report/report_patient_by_doctor.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'beauty_clinic_management/static/src/xml/*.xml',
            'beauty_clinic_management/static/src/js/*.js',
            'beauty_clinic_management/static/src/css/base_new.css'
        ],

    },
    'images': ['images/beauty_clinic_management.gif'],
    'live_test_url': 'http://www.pragtech.co.in/company/proposal-form.html?id=103&name=Odoo-Beauty-Management',
    'license': 'OPL-1',
    'price': 300,
    'currency': 'USD',
    'installable': True,
    'application': True,
    'auto_install': False,
}

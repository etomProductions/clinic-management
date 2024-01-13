odoo.define('beauty_clinic_management.calendar', function(require) {
    'use strict';
    var core = require('web.core');
    var CalendarRenderer = require("web.CalendarRenderer");
    var CalendarView = require("web.CalendarView");
    var CalendarController = require("web.CalendarController");
    var viewRegistry = require('web.view_registry');
    var QWeb = core.qweb;
    var Dialog = require('web.Dialog');
    var _t = core._t;
    var rpc = require('web.rpc');
    var CalendarQuickCreate = require('web.CalendarQuickCreate');
    var QuickCreate = require('web.CalendarQuickCreate');
    var session = require('web.session');
    var CalendarPopover = require('web.CalendarPopover');

    CalendarView.include({
        init: function () {

            this._super.apply(this,arguments);
            console.log("===this.controllerParams.context=====init=====init==",this.controllerParams.context)
            var is_beauty_calender = this.fieldsView.base_model
            if(is_beauty_calender && is_beauty_calender=='medical.appointment'){
                console.log("===this.controllerParams.context=====init=====init==",this.controllerParams.context)
                this.appointment_sdate = this.controllerParams.context.default_appointment_sdate
                if(this.appointment_sdate){
                    var dateObject = new Date(this.appointment_sdate);
                    this.loadParams.initialDate = moment(dateObject);
                }
            }
        }
    })

    CalendarController.include({
        init: function () {
            console.log("==22====init=====init==")
            this._super.apply(this,arguments);
            var is_beauty_calender = this.modelName
            if(is_beauty_calender && is_beauty_calender=='medical.appointment'){
                this.scales = ["day"]
                this.appointment_sdate = this.context.default_appointment_sdate
            }
        },
    });

    var CalendarPopoverInclude = CalendarPopover.include({
        events: _.extend({}, CalendarPopover.prototype.events, {
            'click .o_cw_popover_invoice_m': '_onClickInvoiceOpen',
            'click .o_cw_popover_payment_m': '_onClickPaymentOpen',
            'click .o_cw_popover_note_m': '_onClickNotesOpen',
            'click .o_cw_popover_chart_m': '_onClickChartOpen',
        }),

        init: function (parent, eventInfo) {
            self = this

            self.canInvoice = false;
            self.canPayment = false;
            if(eventInfo.event._def.extendedProps && eventInfo.event._def.extendedProps.record && eventInfo.event._def.extendedProps.record.is_invoice_state){
//                console.log("==IF=====is_invoice_state===",eventInfo.event._def.extendedProps.record.is_invoice_state)
                self.canInvoice = true;
            }
            if(eventInfo.event._def.extendedProps && eventInfo.event._def.extendedProps.record && eventInfo.event._def.extendedProps.record.invoice_amount && eventInfo.event._def.extendedProps.record.invoice_paid){
                var invoice_amount = eventInfo.event._def.extendedProps.record.invoice_amount
                var invoice_paid = eventInfo.event._def.extendedProps.record.invoice_paid
//                console.log("==IF=====invoice_amount===",invoice_amount)
//                console.log("==IF=====invoice_paid===",invoice_paid)
                if(invoice_amount == invoice_paid){
                    self.canPayment = true;
                }
            }
            eventInfo.canDelete = false;

//            console.log("===33===init=====this==",self)
            this._super.apply(this, arguments);
        },

        _onClickInvoiceOpen: function (ev) {
            var self = this;
            var context = {'default_appointment_id': parseInt(this.event.id)};
            return this.do_action({
                name: 'Create: Invoices',
                type: 'ir.actions.act_window',
                res_model: 'calender.invoice.wizard',
                target: 'new',
                views: [[false, 'form']],
                context: context,
            });
        },

        _onClickPaymentOpen: function (ev) {
            var self = this;
            var context = {'default_appointment_id': parseInt(this.event.id)};
            return this.do_action({
                name: 'Register Payment',
                type: 'ir.actions.act_window',
                res_model: 'calender.payment.wizard',
                target: 'new',
                views: [[false, 'form']],
                context: context,
            });
        },


//        _onClickPaymentOpen: function (ev) {
//            var self = this;
//            var context = {'default_appointment_id': parseInt(this.event.id)};
//            return this.do_action({
//                name: 'Register Payment',
//                type: 'ir.actions.act_window',
//                res_model: 'account.payment.register',
//                target: 'new',
//                views: [[false, 'form']],
//                context: context,
//            });
//        },

        _onClickNotesOpen: function (ev) {
            var self = this;
            var context = {'default_appointment_id': parseInt(this.event.id)};
            return this.do_action({
                name: 'Create: Notes',
                type: 'ir.actions.act_window',
                res_model: 'calender.notes.wizard',
                target: 'new',
                views: [[false, 'form']],
                context: context,
            });
        },

        _onClickChartOpen: function (ev) {
            ev.preventDefault();
            var self = this;
            var context = {'default_appointment_id': parseInt(this.event.id)};
            return this.do_action({
                name: 'Face/Body Chart',
                type: 'ir.actions.client',
                tag: 'face_body_chart',
                target: 'current',
                context: context,
            });
        },

        _onClickPopoverEdit: function (ev) {
            ev.preventDefault();
            var self = this;
            var context = {'recordCreated': 'created'};
            self._rpc({
                model: 'medical.appointment',
                method: 'edit_appointment',
                args: [false, parseInt(this.event.id)],
            }).then(function(res){
                if (res) {
                    return self.do_action({
                        name: 'Edit: Appointments',
                        type: 'ir.actions.act_window',
                        res_id: res,
                        res_model: 'calender.appointment.wizard',
                        target: 'new',
                        views: [[false, 'form']],
                        context: context,
                    });
                }
            })
        },
    });

    function dateToServer (date, fieldType) {
        date = date.clone().locale('en');
        if (fieldType === "date") {
            return date.local().format('YYYY-MM-DD');
        }
        return date.utc().format('YYYY-MM-DD HH:mm:ss');
    }
//


    var calendar_custCalendarRenderer = CalendarRenderer.extend({
        events: _.extend({}, CalendarRenderer.events, {
            'click .TimeSlotTD': '_fcWidgetContent',
            'click div.displayTimeSlotsTemp': '_displayTimeSlots',
        }),

        _displayTimeSlots: function (e) {
            var self = this;
            console.log("==e.=====================", e, self.state.target_date.toString(), e.currentTarget.id);
            self._rpc({
                model: 'doctor.slot',
                method: 'get_doctors_slot',
                args: [self.state.target_date.toString(), e.currentTarget.id],
            }).then(function (doctorResult) {
                if (doctorResult) {
                    console.log("=============doctorResult=========",doctorResult)
                    var dtime_slots = doctorResult[0].time_slots
                    var a ='<html><body><div>';
                    for (var k =0; k < dtime_slots.length; k++) {
                        a += "<span style='margin-left: 25px;display: flex'>" + dtime_slots[k].start_hour + ' to ' + dtime_slots[k].end_hour + "</span>";
                    }
                    a += "</div></body></html>"
                    Dialog.alert(self, '', {
                        title: _t("Time Slots of " + e.target.innerText),
                        $content: a
                    });
                }
            });
        },

        _fcWidgetContent: function (ev) {
            var self = this;
            var context = {};
            if(ev.currentTarget.id){
                context['default_doctor_id'] = parseInt(ev.currentTarget.id) || false;
            }
            else if(ev.target.id){
                context['default_doctor_id'] = parseInt(ev.target.id) || false;
            }
            context['from_time'] = ev.currentTarget.dataset.time || $(ev.target).parent()[0].dataset.time;
            context['dateToString'] = self.state.target_date.toString();
            self._rpc({
                model: 'doctor.slot',
                method: 'get_doctors_slot_validation',
                args: [self.state.target_date.toString(), ev.currentTarget.id],
                context: context,
            }).then(function (result) {
                if(result){
                    self.do_action({
                        name: 'Create: Appointments',
                        type: 'ir.actions.act_window',
                        res_model: 'calender.appointment.wizard',
                        target: 'new',
                        views: [[false, 'form']],
                        context: context,
                    });
                }else{
                    var content ='<html><body><div>';
                    content += "<span style='margin-left: 25px;display: flex'>Appointment Slot is not available.</span>";
                    content += "</div></body></html>"
                    Dialog.alert(self, '', {
                        title: _t("Alert"),
                        $content: content,
                    });
                }
            })

        },


        get_doctors_slot_details: function (checkResizeWindow) {
            var $containerHeight = $(window).height();
            var self = this;
            var target_date = self.state.target_date.toString();
            return self._rpc({
                model: 'doctor.slot',
                method: 'get_doctors_slot',
                args: [target_date],
                context: self.context,
            }).then(function (result) {
                if (result) {
                    console.log("==========result++++++++++++++++===========",result)
                    self.$el.parent().find('.fc-time-grid-container').css({
                        'overflow': 'auto',
//                        'height': '449px',
                        'position': 'relative',
                    })
                    var rl = result.length * 280;
                    if (rl <= 1400) {
                        rl = 1400;
                    }
                    self.$el.parent().find('.fc-time-grid').addClass("row");
                    self.$el.parent().find('.fc-time-grid').css({
                       'width' : rl + 'px',
                       'overflow': 'auto',
                       'position': 'relative',
                       'height': '-webkit-fill-available',
                    });
                    var s = self.$el.parent().find('.fc-slats').slice(1).remove();
                    self.$el.parent().find('.fc-slats').addClass("originalTimeslot");
                    self.$el.parent().find('.fc-slats').css({'width': '260px'});

/*                   This code is used for hide the tr and its td if this operation not perform then
                    our td click event not work every time */
                    self.$el.parent().find('.fc-bg').css({
                          'display': 'none'
                        });

                    var preNode = false;
                    var s = self.$el.parent().find('div.fc-slats');

//                  This is used for set the width of appointment create
                    var gridEvent = self.$el.parent().find('a.fc-time-grid-event').css({
                        "width": "90px",
                        "padding-top": "0px",
                        "margin-top": 0 + '%',
                        "background-color": "lightpink",
//                        "margin-top": "1px"
                    })
//                    console.log("=======self.$el========",self.$el)
//                    console.log("=======self.$el.parent()========",self.$el.parent().find('a.fc-time-grid-event').length)


                    if(self.$el.parent().find('a.fc-time-grid-event').length){
                        _.each(self.$el.parent().find('a.fc-time-grid-event'), function(e,i){
                            var top_css = $(e).css("top")
                            var top_a = top_css;
                            var top_b = top_a.replace("px", "");
                            var top_c = parseInt(top_b) - 40;
                            var top_d =  top_c.toString() + 'px';
                            $(e).css("top",top_d)

                            var bottom_css = $(e).css("bottom")
                            var bottom_a = bottom_css;
                            var bottom_b = bottom_a.replace("px", "");
                            var bottom_c = parseInt(bottom_b) + 40;
                            var bottom_d =  bottom_c.toString() + 'px';
                            $(e).css("bottom",bottom_d)
                        })
                    }

                    var divHeight = '20px';
                    for (var j =0; j < result.length; j++) {
                        _.each(s, function(e,i){
                            var trList = $(e).find('table').find('tbody').find('tr');
                            var trFirst = $(e).find('table').find('tbody').find('tr:eq(0)');
                            var trSecond = $(e).find('table').find('tbody').find('tr:eq(1)');
                            divHeight = trFirst.height() + trSecond.height() + 20 + 'px';
                            trFirst.css({'display': 'none'});
                            trSecond.css({'display': 'none'});
                        })
                    }
                    $('.displayTimeSlots').addClass('d-none')
                    for (var j =0; j < result.length; j++) {
                        if (j == 0) {

                            var doctorName = result[j].name;
                            self.$el.parent().find('.fc-slats').attr('id', result[j].id);
                            var doctorDetails = 'doctorDetails_' + j + '_' + result[j].id;
                            var newDynamicClass = 'mypopshow_' + j + '_' + result[j].id;
                            var doctorDiv = $("<div id="+result[j].id+" class=" + doctorDetails +"><strong style='margin-bottom:0px'> "+ result[j].name +
                            "</strong></span>");

                            var dtime_slots = result[j].time_slots
                            var a ='';
                            var slot_length = dtime_slots.length
                            for (var k =0; k < dtime_slots.length; k+=2) {
                                if(k<4){
//                                a += "<p style='font-size: 10px;margin-bottom:0px'>" + dtime_slots[k].start_hour + ' to ' + dtime_slots[k].end_hour + "</p>";
                                    a += "<p style='font-size: 12px;margin-bottom:0px;color: darkgreen;font-weight: bold;'>"
                                    if(k<slot_length){
                                        a += dtime_slots[k].start_hour + ' to ' + dtime_slots[k].end_hour
                                    }
                                     if(k+1<slot_length){
                                        a += ', ' + dtime_slots[k+1].start_hour + ' to ' + dtime_slots[k+1].end_hour
                                    }
                                    a += "</p>";
                                }
                            }

                            doctorDiv.append(a)

//                            self._rpc({
//                                model: 'doctor.slot',
//                                method: 'get_doctors_slot',
//                                args: [self.state.target_date.toString(), result[j].id],
//                            }).then(function (doctorResult) {
//                                if (doctorResult) {
//                                    console.log("=============doctorResult=========",doctorResult)
//                                    var dtime_slots = doctorResult[0].time_slots
//                                    var a ='';
//                                    for (var k =0; k < dtime_slots.length; k++) {
//                                        a += "<p style='font-size: 10px'>" + dtime_slots[k].start_hour + ' to ' + dtime_slots[k].end_hour + "</p>";
//                                    }
//                                    console.log("=============doctorResult=====a====",a)
//                                    console.log("==========doctorDiv=======1=====",doctorDiv)
//                                    doctorDiv.append("<p>Data Here 1.</p>")
//                                    doctorDiv.append("<p>Data Here 2.</p>")
//                                    console.log("==========doctorDiv=======2=====",doctorDiv)
////                                    doctorDiv.append(a)
//                                }
//                            })

//                            console.log("==========doctorDiv=======SECOND=====",doctorDiv)



                            doctorDiv.addClass('displayTimeSlots');
//                            self.$el.parent().find('.fc-slats').prepend(doctorDiv);
                            self.$el.parent().find('.fc-slats').before(doctorDiv);
                        }
                        else {
                            var copyTimeSlot = $('.originalTimeslot').clone();
                            copyTimeSlot.removeClass("originalTimeslot");
                            var doctorName = result[j].name;
                            var doctorDetails = 'doctorDetails_0_' + result[0].id;
                            var currentDoctorDetails = 'doctorDetails_' + j + '_' + result[j].id;

                            copyTimeSlot.find('div.' + doctorDetails).remove()
                            if (!preNode) {
                                preNode = copyTimeSlot.attr('id', result[j].id).insertAfter(self.$el.parent().find('.originalTimeslot'));
                            }
                            else {
                                preNode = copyTimeSlot.attr('id', result[j].id).insertAfter($(preNode));
                            }
                            var doctorDiv = $("<div id="+result[j].id+" class="+ currentDoctorDetails + "><strong> "+ result[j].name + "</strong></span>");

                            var dtime_slots = result[j].time_slots
                            var a ='';
                            var slot_length = dtime_slots.length
                            for (var k =0; k < dtime_slots.length; k+=2) {
                                if(k<4){
//                                a += "<p style='font-size: 10px;margin-bottom:0px'>" + dtime_slots[k].start_hour + ' to ' + dtime_slots[k].end_hour + "</p>";
                                    a += "<p style='font-size: 12px;margin-bottom:0px;color: darkgreen;font-weight: bold;'>"
                                    if(k<slot_length){
                                        a += dtime_slots[k].start_hour + ' to ' + dtime_slots[k].end_hour
                                    }
                                     if(k+1<slot_length){
                                        a += ', ' + dtime_slots[k+1].start_hour + ' to ' + dtime_slots[k+1].end_hour
                                    }
                                    a += "</p>";
                                }
                            }
                            doctorDiv.append(a)

                            doctorDiv.addClass('displayTimeSlots displayTimeSlotsMargin');
//                            doctorDiv.css('margin-left','50px !important');
//                            copyTimeSlot.prepend(doctorDiv);
                            var left_css = j*262
                            copyTimeSlot.css('left',left_css + 'px')
                            copyTimeSlot.before(doctorDiv);
                        }
                    }

                    $('.displayTimeSlots').css({
                      'height': divHeight,
                      "font-size": "16px",
                      "left": "5",
                      "text-align": "center",
                      "color": "darkblue",
                      "padding-top": "0px",
                      "background": "#e6e5e5",
//                     "background": "transparent",
                      "width": "190px",
                      "position": "sticky",
                      "top": "0px",
                      "z-index": "10",
                      "margin-top": "-18px",
                      "margin-bottom": "0px",
                      "margin-left": "73px",
                      "margin-right": "20px",
                    });

//                  This code is used for view appointment after first when
//                  we have multiple appointment create for same doctor on same time slots
                    _.each(gridEvent, function(gride, gridi) {
                        var splitData = $(gride).css('inset').split(" ");

                        if (splitData.length >= 4) {
//                            var first_a = splitData[0];
//                            var first_b = first_a.replace("px", "");
//                            var first_c = parseInt(first_b) + 21;
//                            var first_d =  first_c.toString() + 'px';
//                            console.log("=============splitData=========0======",splitData[0])
//                            console.log("=============first_d===============",first_d)
                            $(gride).css('inset', splitData[0] + ' 0px ' + splitData[2] + ' ' + '95px');
//                            var self = this;
//                            rpc.query({
//                                model: 'medical.appointment',
//                                method: 'check_appointment',
//                                args: [false, $(gride)[0].innerText]
//                            }).then(function(res){
//                                if (res) {
//                                    $(gride).css('inset', splitData[0] + ' 0px ' + splitData[2] + ' ' + '95px');
//                                }
//                            })
                        }
                    })

                    for (var j =0; j < result.length; j++) {
                    //  This is used for set the appointment on particular slot of the doctor based on the time
                        if (j >= 0){
                            var doctor_id = result[j].id;
//                            console.log("==============result=========result=========",result[j])
                            _.each(gridEvent, function(ge, gi){
                                var eventName = $(ge).find(".o_event_title")[0].innerText;
//                                console.log("==============eventName=========",eventName)
                                rpc.query({
                                    model: 'medical.appointment',
                                    method: 'get_data',
                                    args: [false, doctor_id, eventName, j]
                                }).then(function(res){
//                                    console.log("==============res=========",res)
                                    if (res.index >= 1) {
                                        $(ge).css({
                                            "padding-top": "0px",
                                            "width": "90px",
                                            "background-color": "lightpink",
                                            "margin-left": res.index * 260 + 'px'
                                        })
                                        if(res.patient){
                                            $(ge).find(".o_event_title")[0].innerText = res.patient
                                        }

                                    }
                                    else{
                                        if(res.patient){
                                            $(ge).find(".o_event_title")[0].innerText = res.patient
                                        }
                                    }
                                })
                            });
                        }
                    }

                    var allDivColumns = self.$el.parent().find('.fc-slats');
                    _.each(allDivColumns, function(ge, gi) {
                        var doctorID = ge.id;
                        var divTrList = $(ge).find('table').find('tbody').find('tr');
                         _.each(divTrList, function(dtl, dtli){
                            $(dtl).addClass('TimeSlotTD').attr({'id': doctorID});
//                            $(dtl).find("td:eq(0)").addClass('TimeSlotTD).attr({'id': doctorID});
//                            $(dtl).find("td:eq(1)").addClass('TimeSlotTD').attr({'id': doctorID});
                         });
                    });

                    // This code is used for remove the except first element if the child is more than one when we increase or decrease the page size
                    if (self.$el.parent().find('.originalTimeslot').find('div').length >= 1) {
                        self.$el.parent().find('.originalTimeslot').find('div').slice(1).remove()
                    }
               }
               else {
                    self.$el.parent().find('div.originalTimeslot').removeAttr('style');
               }
            });
        },

        _render: function () {
            var self = this;
            console.log("==========_render==========");
            var renderData = this._super.apply(this, arguments).then(self.get_doctors_slot_details());
            return renderData;
        },
    });

//    var CalendarControllerExtended = CalendarController.extend({
//
//        init: function (parent, buttons, options, dataTemplate, dataCalendar) {
//            this.currentModelName = options.model;
//            console.log("==========CalendarController======init====");
//            return this._super.apply(this, arguments);
//        },
//
//        start: function(){
//            this._super.apply(this, arguments)
//        },
//        _onOpenCreate: function (event) {
//            console.log("==========_onOpenCreate======init====");
//            var self = this;
//            if (self.currentModelName === 'medical.appointment') {
//                if (["year", "month"].includes(this.model.get().scale)) {
//                    event.data.allDay = true;
//                }
//                var data = this.model.calendarEventToRecord(event.data);
////                console.log("==event==", event);
//                console.log("==data==", data);
//                var context = _.extend({}, this.context, event.options && event.options.context);
//                var a = document.getElementsByClassName("currentActive");
//                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa-->", a);
////                var a = $(".currentActive");
////                console.log("llllllllllllllllllllll-->", a);
//                if (a.length > 0) {
//                    console.log("======a--------------->", a, parseInt(a[0].id));
//                    context['default_doctor_id'] = parseInt(a[0].id);
//                }
//                var targetTD = document.getElementsByClassName("currentActive");
//                if (targetTD.length > 0) {
//                    $(targetTD).removeClass("currentActive")
//                }
//                if (data.name) {
//                    context.default_name = data.name;
//                }
//                context['default_' + this.mapping.date_start] = data[this.mapping.date_start] || null;
//                if (this.mapping.date_stop) {
//                    context['default_' + this.mapping.date_stop] = data[this.mapping.date_stop] || null;
//                }
//                if (this.mapping.date_delay) {
//                    context['default_' + this.mapping.date_delay] = data[this.mapping.date_delay] || null;
//                }
//                if (this.mapping.all_day) {
//                    context['default_' + this.mapping.all_day] = data[this.mapping.all_day] || null;
//                }
//                var start_time = moment.utc(context['default_appointment_sdate']).local().format("HH:mm");
//                var end_time = moment.utc(context['default_appointment_edate']).local().format("HH:mm");
//                console.log(" MY==mapping==", this.mapping);
//                console.log("=MY=context==", context);
//                for (var k in context) {
//                    if (context[k] && context[k]._isAMomentObject) {
//                        context[k] = dateToServer(context[k]);
//                    }
//                }
//                var patient_ids = rpc.query({
//                    model: 'res.users',
//                    method: 'get_patient_details',
//                    args: [session.uid, session.uid],
//                }).then(function(res){
//                    $('.patient_list').find('.option').remove();
//                    $('.patient_list').prepend("<option value='' selected='selected'></option>");
//                    _.each(res, function(e,i){
//                        var p_name = res[i].partner_id[1];
//                        var p_id = res[i].id;
//                        $('.patient_list').append('<option class="patient_option" id=' + p_id + ' value=' + p_id + '>' + p_name + '</option>');
//                    })
//                    $(".patient_list").select2();
//                })
//
//                var duration_ids = rpc.query({
//                    route: '/get_duration_list',
//                }).then(function(res){
//                    $('select.duration_list').find('.option').remove();
//                    $('select.duration_list').prepend("<option value='' selected='selected'></option>");
//                    _.each(res, function(e,i){
//                        var duration_name = res[i].duration_name;
//                        $('select.duration_list').append('<option class="duration_option" id=' + res[i].id +  ' value=' + duration_name + '>' + duration_name + '</option>');
//                    })
//                    $(".duration_list").select2();
//                })
//
//                var options = _.extend({}, this.options, event.options, {
//                    myData: "aaaaaaaaaaaaaaaaaaaaaaaa",
//                    start_time: start_time,
//                    end_time: end_time,
//                    default_appointment_sdate: moment.utc(context['default_appointment_sdate']).local(),
//                    currentModelName: self.currentModelName,
//                    context: context,
//                    title: _.str.sprintf(_t('Create: %s'), (this.displayName || this.renderer.arch.attrs.string))
//                });
//
//                context['default_from_time'] = parseFloat(start_time);
//                context['default_to_time'] = parseFloat(end_time);
//                if (this.quick != null) {
//                    this.quick.destroy();
//                    this.quick = null;
//                }
//
//                if (!options.disableQuickCreate && !event.data.disableQuickCreate && this.quickAddPop) {
//
//                    return this.do_action({
//                        type: 'ir.actions.act_window',
//                        res_model: 'calender.appointment.wizard',
////                        views: [[this.formViewId || false, 'form']],
//                        target: 'new',
//                        views: [[false, 'form']],
//                        context: context,
//                    });
//
////                    this.quick = new QuickCreate(this, true, options, data, event.data);
////                    this.quick.open();
////                    this.quick.opened(function () {
////                        self.quick.focus();
////                    });
////                    return;
//                }
//                var title = _t("Create");
//                if (this.renderer.arch.attrs.string) {
//                    title += ': ' + this.renderer.arch.attrs.string;
//                }
//                if (this.eventOpenPopup) {
//                    if (this.previousOpen) { this.previousOpen.close(); }
//                    this.previousOpen = new dialogs.FormViewDialog(self, {
//                        res_model: this.modelName,
//                        context: context,
//                        title: title,
//                        view_id: this.formViewId || false,
//                        disable_multiple_selection: true,
//                        on_saved: function () {
//                            if (event.data.on_save) {
//                                event.data.on_save();
//                            }
//                            self.reload();
//                        },
//                    });
//                    this.previousOpen.open();
//                } else {
//                    this.do_action({
//                        type: 'ir.actions.act_window',
//                        res_model: this.modelName,
//                        views: [[this.formViewId || false, 'form']],
//                        target: 'current',
//                        context: context,
//                    });
//                }
//            }
//            else {
//                this._super.apply(this, arguments);
//            }
//        },
//    });

    var calendar_custCalendarView = CalendarView.extend({
        config: _.extend({}, CalendarView.prototype.config, {
//            Controller: CalendarControllerExtended,
            Renderer: calendar_custCalendarRenderer,
        }),
    });

    viewRegistry.add('beauty_calendar', calendar_custCalendarView);
    return calendar_custCalendarView;
});

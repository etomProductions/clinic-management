odoo.define('beauty_clinic_management.face_body_action', function(require) {
    "use strict";

    var core = require('web.core');
    var AbstractAction = require('web.AbstractAction');
    var Model = require('web.data');
    var rpc = require('web.rpc');



    // Main FaceBody Chart View
    var FaceBodyChartView = AbstractAction.extend({

        template: "FaceBodyChartView",

        cssLibs: [
            '/beauty_clinic_management/static/src/css/select2.min.css'
        ],

        jsLibs: [
            '/beauty_clinic_management/static/src/js/select2.min.js'
        ],

        events: {
            "click #faceBtn": "_onClickFaceBtn",
            "click #bodyBtn": "_onClickBodyBtn",

            "mousedown #myCanvas": "_onMouseDownMyCanvas",
            "mousemove #myCanvas": "_onMouseMoveMyCanvas",
            "mouseup #myCanvas": "_onMouseUpMyCanvas",
            "mouseleave #myCanvas": "_onMouseLeaveMyCanvas",

            "mousedown #myCanvasBody": "_onMouseDownMyCanvasBody",
            "mousemove #myCanvasBody": "_onMouseMoveMyCanvasBody",
            "mouseup #myCanvasBody": "_onMouseUpMyCanvasBody",
            "mouseleave #myCanvasBody": "_onMouseLeaveMyCanvasBody",

            "click #saveFaceBtn": "_onClickSaveFaceBtn",
            "click #undoFaceBtn": "_onClickUndoFaceBtn",
            "click #deleteFaceBtn": "_onClickDeleteFaceBtn",
            "click #editFaceBtn": "_onClickEditFaceBtn",

            "click #saveBodyBtn": "_onClickSaveBodyBtn",
            "click #undoBodyBtn": "_onClickUndoBodyBtn",
            "click #deleteBodyBtn": "_onClickDeleteBodyBtn",
            "click #editBodyBtn": "_onClickEditBodyBtn",

            "click #saveTreatmentBtn": "_onClickSaveTreatmentBtn",
            "click #editTreatmentBtn": "_onClickEditTreatmentBtn",
            "click #saveTreatmentBodyBtn": "_onClickSaveTreatmentBodyBtn",
            "click #editTreatmentBodyBtn": "_onClickEditTreatmentBodyBtn",

            "click #saveMaterialBtn": "_onClickSaveMaterialBtn",
            "click #editMaterialBtn": "_onClickEditMaterialBtn",
            "click #saveMaterialBodyBtn": "_onClickSaveMaterialBodyBtn",
            "click #editMaterialBodyBtn": "_onClickEditMaterialBodyBtn",

            "click #addFaceMaterial": "_onClickAddFaceMaterialBtn",
            "click .delFaceRow": "_onClickDelFaceRowBtn",
            "change .productFaceRow": "_onChangeProductFaceRow",
            "change .inputQauntity": "_onChangeInputQauntity",
            "change .inputUnitPrice": "_onChangeInputUnitPrice",

            "click #addBodyMaterial": "_onClickAddBodyMaterialBtn",
            "click .delBodyRow": "_onClickDelBodyRowBtn",
            "change .productBodyRow": "_onChangeProductBodyRow",
            "change .inputQauntityBody": "_onChangeInputQauntityBody",
            "change .inputUnitPriceBody": "_onChangeInputUnitPriceBody",
        },

        // For Face Mouse Event
        _onMouseDownMyCanvas: function(e) {
            if (!this.is_edit) {
                e.preventDefault();
                var self = this
                this.mousePressed = true;
                this.Draw(e.pageX - self.$el.find("#myCanvas").offset().left, e.pageY - self.$el.find("#myCanvas").offset().top, false);
            }
        },

        _onMouseMoveMyCanvas: function(e) {
            if (!this.is_edit) {
                var self = this
                if (this.mousePressed) {
                    this.Draw(e.pageX - self.$el.find("#myCanvas").offset().left, e.pageY - self.$el.find("#myCanvas").offset().top, true);
                }
            }
        },

        _onMouseUpMyCanvas: function(ev) {
            if (!this.is_edit) {
                this.mousePressed = false;
                this.multi_mark.push(this.single_mark)

                console.log("========mouseup=======mouseup==", this.multi_mark)
                this.single_mark = []
            }
        },

        _onMouseLeaveMyCanvas: function(ev) {
            if (!this.is_edit) {
                this.mousePressed = false;
            }
        },
        // For Face Mouse Event End


        // For Body Mouse Event
        _onMouseDownMyCanvasBody: function(e) {
            if (!this.is_edit_body) {
                e.preventDefault();
                var self = this
                this.mousePressedBody = true;
                this.DrawBody(e.pageX - self.$el.find("#myCanvasBody").offset().left, e.pageY - self.$el.find("#myCanvasBody").offset().top, false);
            }
        },

        _onMouseMoveMyCanvasBody: function(e) {
            if (!this.is_edit_body) {
                var self = this
                if (this.mousePressedBody) {
                    this.DrawBody(e.pageX - self.$el.find("#myCanvasBody").offset().left, e.pageY - self.$el.find("#myCanvasBody").offset().top, true);
                }
            }
        },

        _onMouseUpMyCanvasBody: function(ev) {
            if (!this.is_edit_body) {
                this.mousePressedBody = false;
                this.multi_mark_body.push(this.single_mark_body)
                this.single_mark_body = []
            }
        },

        _onMouseLeaveMyCanvasBody: function(ev) {
            if (!this.is_edit_body) {
                this.mousePressedBody = false;
            }
        },
        // For Body Mouse Event End


        // Main Draw Function For Face
        Draw: function(x, y, isDown) {
            if (isDown) {
                var single_cordinate = []
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'black';
                this.ctx.lineWidth = 5;
                this.ctx.lineJoin = "round";
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.closePath();
                this.ctx.stroke();
                single_cordinate.push(this.lastX, this.lastY, x, y)
                this.single_mark.push(single_cordinate)
            }
            this.lastX = x;
            this.lastY = y;
        },

        // Main Draw Function For Body
        DrawBody: function(x, y, isDown) {
            if (isDown) {
                var single_cordinate_body = []
                this.ctxBody.beginPath();
                this.ctxBody.strokeStyle = 'black';
                this.ctxBody.lineWidth = 5;
                this.ctxBody.lineJoin = "round";
                this.ctxBody.moveTo(this.lastXBody, this.lastYBody);
                this.ctxBody.lineTo(x, y);
                this.ctxBody.closePath();
                this.ctxBody.stroke();
                single_cordinate_body.push(this.lastXBody, this.lastYBody, x, y)
                this.single_mark_body.push(single_cordinate_body)
            }
            this.lastXBody = x;
            this.lastYBody = y;
        },


        // Face Buttons Funcnality
        _onClickSaveFaceBtn: function(ev) {
            var self = this;

            // Save Data New Marks
            if (self.appointment_id && this.multi_mark) {
                for (var i = 0; i < this.multi_mark.length; i++) {
                    var data = {
                        'name': this.multi_mark[i],
                        'appointment_id': parseInt(self.appointment_id),
                    }
                    rpc.query({
                        model: 'medical.markers.history',
                        method: 'create',
                        args: [data],
                    })
                }
                this.multi_mark = []
                this.is_edit = true
            }

            // Delete Data Old Marks
            if (self.appointment_id && this.delete_ids) {
                var self = this
                rpc.query({
                    model: 'medical.markers.history',
                    method: 'unlink',
                    args: [this.delete_ids],
                })
                this.delete_ids = []
            }

        },

        _onClickUndoFaceBtn: function(ev) {
            var self = this;
            if (this.multi_mark) {
                var lastElement = this.multi_mark.pop();
                //console.log("=============lastElement=====lastElement==",lastElement);
                if (lastElement) {
                    for (var i = 0; i < lastElement.length; i++) {
                        var sub_data = lastElement[i]
                        //this.ctx.clearRect(sub_data[0]-6,sub_data[1]-6,10,10);
                        //this.ctx.clearRect(sub_data[2]-6,sub_data[3]-6,10,10);
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = 'white';
                        this.ctx.lineWidth = 6;
                        this.ctx.lineJoin = "round";
                        this.ctx.moveTo(sub_data[0], sub_data[1]);
                        this.ctx.lineTo(sub_data[2], sub_data[3]);
                        this.ctx.closePath();
                        this.ctx.stroke();
                    }
                }
            }
        },

        _onClickDeleteFaceBtn: function(ev) {
            var self = this;

            // Existing Marks Delete
            if (this.multi_mark && !this.is_edit) {
                for (var k = 0; k < this.multi_mark.length; k++) {
                    var lastElement = this.multi_mark[k]
                    for (var i = 0; i < lastElement.length; i++) {
                        var sub_data = lastElement[i]
                        //this.ctx.clearRect(sub_data[0]-6,sub_data[1]-6,10,10);
                        //this.ctx.clearRect(sub_data[2]-6,sub_data[3]-6,10,10);
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = 'white';
                        this.ctx.lineWidth = 7;
                        this.ctx.lineJoin = "round";
                        this.ctx.moveTo(sub_data[0], sub_data[1]);
                        this.ctx.lineTo(sub_data[2], sub_data[3]);
                        this.ctx.closePath();
                        this.ctx.stroke();
                    }
                }
                this.multi_mark = []
            }

            // Old Marks Delete
            if (self.appointment_id && !this.is_edit) {
                rpc.query({
                    model: 'medical.markers.history',
                    method: 'search_read',
                    domain: [
                        ['appointment_id', '=', parseInt(this.appointment_id)],
                    ],
                }).then(function(data) {
                    for (var k = 0; k < data.length; k++) {
                        var strCoordinate = data[k]['name']
                        var mark_id = parseInt(data[k]['id'])
                        console.log("============mark_id========", mark_id)
                        self.delete_ids.push(mark_id)
                        var singleArray = strCoordinate.replace(/'/g, '"');
                        var dataCoor = JSON.parse(singleArray)
                        if (dataCoor) {
                            for (var i = 0; i < dataCoor.length; i++) {
                                var sub_data = dataCoor[i]
                                var ctx = self.$el.find("#myCanvas")[0].getContext("2d");
                                ctx.beginPath();
                                ctx.strokeStyle = 'white';
                                ctx.lineWidth = 7;
                                ctx.lineJoin = "round";
                                ctx.moveTo(sub_data[0], sub_data[1]);
                                ctx.lineTo(sub_data[2], sub_data[3]);
                                ctx.closePath();
                                ctx.stroke();
                            }
                        }
                    }
                })
            }

        },

        _onClickEditFaceBtn: function(ev) {
            this.is_edit = false
        },


        // Body Buttons Funcnality
        _onClickSaveBodyBtn: function(ev) {
            var self = this;

            // Save Data New Marks
            if (self.appointment_id && this.multi_mark_body) {
                for (var i = 0; i < this.multi_mark_body.length; i++) {
                    var data = {
                        'name': this.multi_mark_body[i],
                        'appointment_id': parseInt(self.appointment_id),
                    }

                    rpc.query({
                        model: 'medical.body.markers.history',
                        method: 'create',
                        args: [data],
                    })

                }
                this.multi_mark_body = []
                this.is_edit_body = true
            }

            // Delete Data Old Marks
            if (self.appointment_id && this.delete_body_ids) {
                var self = this
                rpc.query({
                    model: 'medical.body.markers.history',
                    method: 'unlink',
                    args: [this.delete_body_ids],
                })
                this.delete_body_ids = []
            }

        },

        _onClickUndoBodyBtn: function(ev) {
            var self = this;
            if (this.multi_mark_body) {
                var lastElement = this.multi_mark_body.pop();
                console.log("=============lastElement=======", lastElement);
                if (lastElement) {
                    for (var i = 0; i < lastElement.length; i++) {
                        console.log("====SUB===1=", lastElement[i].length);

                        console.log("====SUB===2=", lastElement[i]);
                        var sub_data = lastElement[i]

                        this.ctxBody.beginPath();
                        this.ctxBody.strokeStyle = 'white';
                        this.ctxBody.lineWidth = 6;
                        this.ctxBody.lineJoin = "round";
                        this.ctxBody.moveTo(sub_data[0], sub_data[1]);
                        this.ctxBody.lineTo(sub_data[2], sub_data[3]);
                        this.ctxBody.closePath();
                        this.ctxBody.stroke();

                    }
                }
            }
        },

        _onClickDeleteBodyBtn: function(ev) {
            var self = this;

            // Existing Marks Delete
            if (this.multi_mark_body && !this.is_edit_body) {
                for (var k = 0; k < this.multi_mark_body.length; k++) {
                    var lastElement = this.multi_mark_body[k]
                    for (var i = 0; i < lastElement.length; i++) {
                        var sub_data = lastElement[i]

                        this.ctxBody.beginPath();
                        this.ctxBody.strokeStyle = 'white';
                        this.ctxBody.lineWidth = 7;
                        this.ctxBody.lineJoin = "round";
                        this.ctxBody.moveTo(sub_data[0], sub_data[1]);
                        this.ctxBody.lineTo(sub_data[2], sub_data[3]);
                        this.ctxBody.closePath();
                        this.ctxBody.stroke();
                    }
                }
                this.multi_mark_body = []
            }

            // Old Marks Delete
            if (self.appointment_id && !this.is_edit_body) {
                rpc.query({
                    model: 'medical.body.markers.history',
                    method: 'search_read',
                    domain: [
                        ['appointment_id', '=', parseInt(this.appointment_id)],
                    ],
                }).then(function(data) {
                    for (var k = 0; k < data.length; k++) {
                        var strCoordinate = data[k]['name']
                        var mark_id = parseInt(data[k]['id'])
                        console.log("============mark_id====BODY====", mark_id)
                        self.delete_body_ids.push(mark_id)
                        var singleArray = strCoordinate.replace(/'/g, '"');
                        var dataCoor = JSON.parse(singleArray)
                        if (dataCoor) {
                            for (var i = 0; i < dataCoor.length; i++) {
                                var sub_data = dataCoor[i]
                                var ctxBody = self.$el.find("#myCanvasBody")[0].getContext("2d");
                                ctxBody.beginPath();
                                ctxBody.strokeStyle = 'white';
                                ctxBody.lineWidth = 7;
                                ctxBody.lineJoin = "round";
                                ctxBody.moveTo(sub_data[0], sub_data[1]);
                                ctxBody.lineTo(sub_data[2], sub_data[3]);
                                ctxBody.closePath();
                                ctxBody.stroke();
                            }
                        }
                    }
                })
            }

        },

        _onClickEditBodyBtn: function(ev) {
            this.is_edit_body = false
            console.log("=============_onClickEditBodyBtn===CALL======", )
        },


        // Treatment Face Buttons Funcnality
        _onClickSaveTreatmentBtn: function(ev) {
            var self = this;
            var treatment_note = $('#treatment_note').val()
            console.log("============_onClickSaveTreatmentBtn=========", treatment_note)
            console.log("============_onClickSaveTreatmentBtn=========", self.appointment_id)

            if (self.appointment_id && treatment_note) {
                console.log("============RPC CALL=========")
                rpc.query({
                    model: 'medical.appointment',
                    method: 'write',
                    args: [
                        [this.appointment_id], {
                            treatment_note: treatment_note,
                        }
                    ],
                })
                $("#treatment_note").attr("disabled", "disabled");
            }

        },

        _onClickEditTreatmentBtn: function(ev) {
            var self = this;
            console.log("============_onClickEditTreatmentBtn=========", treatment_note)
            $("#treatment_note").attr("disabled", false);
        },


        // Treatment Body Buttons Funcnality
        _onClickSaveTreatmentBodyBtn: function(ev) {
            var self = this;
            var treatment_body_note = $('#treatment_body_note').val()

            if (self.appointment_id && treatment_body_note) {
                rpc.query({
                    model: 'medical.appointment',
                    method: 'write',
                    args: [
                        [this.appointment_id], {
                            treatment_body_note: treatment_body_note,
                        }
                    ],
                })
                $("#treatment_body_note").attr("disabled", "disabled");

            }
        },

        _onClickEditTreatmentBodyBtn: function(ev) {
            var self = this;
            $("#treatment_body_note").attr("disabled", false);
        },



        // Face Table Oerations
        _onClickAddFaceMaterialBtn: function(ev) {
            var self = this
            console.log("============_onClickAddFaceMaterialBtn=======", self.products)
            var newRow = $("<tr>")
            var cols = ""
            var productSelect = '<select class="form-control productFaceRow">'
            productSelect += '<option value="">Select Material</option>'
            if (self.products) {
                for (var k = 0; k < self.products.length; k++) {
                    productSelect = productSelect + '<option value="' + self.products[k].id + '">' + self.products[k].name + '</option>'
                }
            }
            productSelect += "</select>"
            cols += '<td>' + productSelect + '</td>';
            cols += '<td><input type="number" class="form-control inputQauntity" name="quantity" value="1"/></td>';
            cols += '<td><input type="number" class="form-control inputUnitPrice" name="unit_price"/></td>';
            cols += '<td><input type="number" class="form-control" name="subtotal" readonly="readonly"/></td>';
            cols += '<td><i class="fa fa-trash mt-2 delFaceRow" style="color: red;font-size: 16px;cursor: pointer;"></i></td>';
            newRow.append(cols)
            $("#faceMaterialTable").append(newRow)
        },

        _onClickDelFaceRowBtn: function(ev) {
            var self = this
            ev.currentTarget.closest("tr").remove();
            self._calculationSubtotal(ev)
        },

        _onChangeInputQauntity: function(ev) {
            var self = this
            self._calculationSubtotal(ev)
        },

        _onChangeInputUnitPrice: function(ev) {
            var self = this
            self._calculationSubtotal(ev)
        },

        _onChangeProductFaceRow: function(ev) {
            var self = this
            console.log("=========_onChangeProductFaceRow=======", ev)
            var productId = $(ev.currentTarget).val()
            if (productId) {
                console.log("=======productId======", productId)
                rpc.query({
                    model: 'product.product',
                    method: 'search_read',
                    domain: [
                        ['id', '=', parseInt(productId)],
                    ],
                }).then(function(data) {
                    console.log("============productPrice===========", data[0].lst_price)
                    if (data) {
                        if (data[0].lst_price) {
                            $(ev.currentTarget).closest("tr").find('td input[name="unit_price"]').val(data[0].lst_price)
                            self._calculationSubtotal(ev)
                        }
                    }
                });
            }
        },

        _calculationSubtotal: function(ev) {
            var qauntity = $(ev.currentTarget).closest("tr").find('td input[name="quantity"]').val()
            var unit_price = $(ev.currentTarget).closest("tr").find('td input[name="unit_price"]').val()
            if (qauntity && unit_price) {
                $(ev.currentTarget).closest("tr").find('td input[name="subtotal"]').val(parseInt(qauntity) * parseInt(unit_price))
            }
            var total = 0
            $('#faceMaterialTable tbody tr').each(function() {
                var subtotal = parseInt($(this).find('td input[name="subtotal"]').val())
                total += subtotal
            })
            console.log("=====_calculationSubtotal========", $('#faceTotal'))
            console.log("=====_calculationSubtotal========", total)
            if (total) {
                $('#faceTotal').html(total)
            }else{
                $('#faceTotal').html(0)
            }
        },

        _onClickSaveMaterialBtn: function(ev) {
            var self = this;

            console.log("============_onClickSaveMaterialBtn=====SAVE====")

            rpc.query({
                    model: 'medical.appointment',
                    method: 'write',
                    args: [[this.appointment_id], {
                        face_order_line_ids: [[5]],
                    }],
               }).then(function(data){
                    console.log("============RPC CALL====DATA=====",data)
               })

            $('#faceMaterialTable tbody tr').each(function() {
                var product_id = $(this).find('td select.productFaceRow').val()
                var quantity = $(this).find('td input[name="quantity"]').val()
                var unit_price = $(this).find('td input[name="unit_price"]').val()
                console.log("============product_id========", product_id)
                console.log("============quantity========", quantity)
                console.log("============unit_price========", unit_price)
                if (self.appointment_id && product_id) {
                    var data = {
                        'product_id': product_id,
                        'quantity': quantity,
                        'unit_price': unit_price,
                        'appointment_id': parseInt(self.appointment_id),
                    }
                    rpc.query({
                        model: 'face.order.line',
                        method: 'create',
                        args: [data],
                    })
                }
            })

            $('#faceMaterialTable tbody tr').each(function(){
                $(this).find('td select.productFaceRow').attr("disabled", true);
                $(this).find('td input[name="quantity"]').prop('readonly', true);
                $(this).find('td input[name="unit_price"]').prop('readonly', true);
                $(this).find('td .delFaceRow').addClass("d-none");
                $("#addFaceMaterial").addClass("d-none");
            })



            /*  M2M save value

            var faces_select = $('#faces_select').val()
           if(self.appointment_id && faces_select){
               console.log("============RPC CALL=========",faces_select)

               rpc.query({
                    model: 'medical.appointment',
                    method: 'write',
                    args: [[this.appointment_id], {
                        face_material_usage_ids: [[5]],
                    }],
               }).then(function(data){
                    console.log("============RPC CALL====DATA=====",data)
                    for (var k = 0; k < faces_select.length; k++) {
                        console.log("============RPC CALL====faces_select[k]=====",faces_select[k])
                        rpc.query({
                            model: 'medical.appointment',
                            method: 'write',
                            args: [[self.appointment_id], {
                                face_material_usage_ids: [[4,faces_select[k]]],
                            }],
                       })
                   }
                   $("#faces_select").select2().enable(false);
               })

           }
            */
        },

        _onClickEditMaterialBtn: function(ev) {
            //           $("#faces_select").select2().enable(true);
            var self = this;
            console.log("============_onClickEditMaterialBtn=====EDIT==123==",$('#faceMaterialTable'))

           $('#faceMaterialTable tbody tr').each(function(){
                $(this).find('td select.productFaceRow').attr("disabled", false);
                $(this).find('td input[name="quantity"]').prop('readonly', false);
                $(this).find('td input[name="unit_price"]').prop('readonly', false);
                $(this).find('td .delFaceRow').removeClass("d-none");
                $("#addFaceMaterial").removeClass("d-none");
           })
        },


        // Body Table Oerations
        _onClickAddBodyMaterialBtn: function(ev) {
            var self = this
            console.log("============_onClickAddBodyMaterialBtn=======", self.products)
            var newRow = $("<tr>")
            var cols = ""
            var productSelect = '<select class="form-control productBodyRow">'
            productSelect += '<option value="">Select Material</option>'
            if (self.products) {
                for (var k = 0; k < self.products.length; k++) {
                    productSelect = productSelect + '<option value="' + self.products[k].id + '">' + self.products[k].name + '</option>'
                }
            }
            productSelect += "</select>"
            cols += '<td>' + productSelect + '</td>';
            cols += '<td><input type="number" class="form-control inputQauntityBody" name="quantity" value="1"/></td>';
            cols += '<td><input type="number" class="form-control inputUnitPriceBody" name="unit_price"/></td>';
            cols += '<td><input type="number" class="form-control" name="subtotal" readonly="readonly"/></td>';
            cols += '<td><i class="fa fa-trash mt-2 delBodyRow" style="color: red;font-size: 16px;cursor: pointer;"></i></td>';
            newRow.append(cols)
            $("#bodyMaterialTable").append(newRow)
        },

        _onClickDelBodyRowBtn: function(ev) {
            var self = this
            ev.currentTarget.closest("tr").remove();
            self._calculationSubtotalBody(ev)
        },

        _onChangeInputQauntityBody: function(ev) {
            var self = this
            self._calculationSubtotalBody(ev)
        },

        _onChangeInputUnitPriceBody: function(ev) {
            var self = this
            self._calculationSubtotalBody(ev)
        },

        _onChangeProductBodyRow: function(ev) {
            var self = this
            console.log("=========_onChangeProductFaceRow=======", ev)
            var productId = $(ev.currentTarget).val()
            if (productId) {
                console.log("=======productId======", productId)
                rpc.query({
                    model: 'product.product',
                    method: 'search_read',
                    domain: [
                        ['id', '=', parseInt(productId)],
                    ],
                }).then(function(data) {
                    console.log("============productPrice===========", data[0].lst_price)
                    if (data) {
                        if (data[0].lst_price) {
                            $(ev.currentTarget).closest("tr").find('td input[name="unit_price"]').val(data[0].lst_price)
                            self._calculationSubtotalBody(ev)
                        }
                    }
                });
            }
        },

        _calculationSubtotalBody: function(ev) {
            var qauntity = $(ev.currentTarget).closest("tr").find('td input[name="quantity"]').val()
            var unit_price = $(ev.currentTarget).closest("tr").find('td input[name="unit_price"]').val()
            if (qauntity && unit_price) {
                $(ev.currentTarget).closest("tr").find('td input[name="subtotal"]').val(parseInt(qauntity) * parseInt(unit_price))
            }
            var total = 0
            $('#bodyMaterialTable tbody tr').each(function() {
                var subtotal = parseInt($(this).find('td input[name="subtotal"]').val())
                total += subtotal
            })
            console.log("=====_calculationSubtotal========", $('#faceTotal'))
            console.log("=====_calculationSubtotal========", total)
            if (total) {
                $('#bodyTotal').html(total)
            }else{
                $('#bodyTotal').html(0)
            }
        },

        _onClickSaveMaterialBodyBtn: function(ev) {
            var self = this;

            console.log("============_onClickSaveMaterialBtn=====SAVE====")

            rpc.query({
                    model: 'medical.appointment',
                    method: 'write',
                    args: [[this.appointment_id], {
                        body_order_line_ids: [[5]],
                    }],
               }).then(function(data){
                    console.log("============RPC CALL====DATA=====",data)
               })

            $('#bodyMaterialTable tbody tr').each(function() {
                var product_id = $(this).find('td select.productBodyRow').val()
                var quantity = $(this).find('td input[name="quantity"]').val()
                var unit_price = $(this).find('td input[name="unit_price"]').val()
                if (self.appointment_id && product_id) {
                    var data = {
                        'product_id': product_id,
                        'quantity': quantity,
                        'unit_price': unit_price,
                        'appointment_id': parseInt(self.appointment_id),
                    }
                    rpc.query({
                        model: 'body.order.line',
                        method: 'create',
                        args: [data],
                    })
                }
            })

            $('#bodyMaterialTable tbody tr').each(function(){
                $(this).find('td select.productBodyRow').attr("disabled", true);
                $(this).find('td input[name="quantity"]').prop('readonly', true);
                $(this).find('td input[name="unit_price"]').prop('readonly', true);
                $(this).find('td .delBodyRow').addClass("d-none");
                $("#addBodyMaterial").addClass("d-none");
            })

        },

        _onClickEditMaterialBodyBtn: function(ev) {
           var self = this;
           $('#bodyMaterialTable tbody tr').each(function(){
                $(this).find('td select.productBodyRow').attr("disabled", false);
                $(this).find('td input[name="quantity"]').prop('readonly', false);
                $(this).find('td input[name="unit_price"]').prop('readonly', false);
                $(this).find('td .delBodyRow').removeClass("d-none");
                $("#addBodyMaterial").removeClass("d-none");
           })
        },




        // Main Face Top Button
        _onClickFaceBtn: function(ev) {
            $('.globle_btn').removeClass('btn-primary text-white')
            $('.globle_btn').addClass('btn-secondary')
            $('#faceBtn').removeClass('btn-secondary')
            $('#faceBtn').addClass('btn-primary text-white')

            $('.globleImage').addClass('d-none')
            $('#myCanvas').removeClass('d-none')
            $('#myCanvasBtns').removeClass('d-none')
            $('#myCanvasContent').removeClass('d-none')
        },

        // Main Body Top Button
        _onClickBodyBtn: function(ev) {
            $('.globle_btn').removeClass('btn-primary text-white')
            $('.globle_btn').addClass('btn-secondary')
            $('#bodyBtn').removeClass('btn-secondary')
            $('#bodyBtn').addClass('btn-primary text-white')

            $('.globleImage').addClass('d-none')
            $('#myCanvasBody').removeClass('d-none')
            $('#myCanvasBodyBtns').removeClass('d-none')
            $('#myCanvasBodyContent').removeClass('d-none')
        },


        init: function(parent, context) {
            var self = this;
            this._super(parent, context);

            this.is_edit = false
            this.delete_ids = []

            this.is_edit_body = false
            this.delete_body_ids = []

            this.appointment_id = context.context.default_appointment_id
        },

        willStart: function() {
            var self = this;
            var def = this._super.apply(this, arguments);
            if (this.appointment_id) {
                var def0 = rpc.query({
                    model: 'medical.markers.history',
                    method: 'search_read',
                    domain: [
                        ['appointment_id', '=', parseInt(this.appointment_id)],
                    ],
                }).then(function(data) {
                    if (data.length) {
                        self.is_edit = true
                    }
                });

                var def1 = rpc.query({
                    model: 'medical.body.markers.history',
                    method: 'search_read',
                    domain: [
                        ['appointment_id', '=', parseInt(this.appointment_id)],
                    ],
                }).then(function(data) {
                    if (data.length) {
                        self.is_edit_body = true
                    }
                })

                var def2 = this._rpc({
                    model: 'product.product',
                    method: 'search_read',
                    fields: ['name'],
                    domain: [
                        ['is_material', '=', true],
                    ],
                }).then(function(resp) {
                    console.log("========MATERIAL PRODUCTS===========", resp)
                    self.products = resp
                });

                return $.when(def0, def1, def2);
            }
            return def

        },

        start: function() {
            var self = this;
            var def = this._super.apply(this, arguments);
            this.appointment_id = self.searchModel.config.context.default_appointment_id || self.searchModelConfig.context.default_appointment_id;

            this.ctx = self.$el.find("#myCanvas")[0].getContext("2d");
            this.mousePressed = false;
            this.lastX = 0;
            this.lastY = 0;
            this.single_mark = []
            this.multi_mark = []

            this.ctxBody = self.$el.find("#myCanvasBody")[0].getContext("2d");
            this.mousePressedBody = false;
            this.lastXBody = 0;
            this.lastYBody = 0;
            this.single_mark_body = []
            this.multi_mark_body = []

            console.log("========STARRT========", self.$el.find(".js-example-basic-multiple"))
            self.$el.find('.js-example-basic-multiple').select2();

            if (this.appointment_id) {
                // For Getting Face Chart Marker
                rpc.query({
                    model: 'medical.markers.history',
                    method: 'search_read',
                    domain: [
                        ['appointment_id', '=', parseInt(this.appointment_id)],
                    ],
                }).then(function(data) {
                    for (var k = 0; k < data.length; k++) {
                        var strCoordinate = data[k]['name']
                        var singleArray = strCoordinate.replace(/'/g, '"');
                        var dataCoor = JSON.parse(singleArray)
                        if (dataCoor) {
                            for (var i = 0; i < dataCoor.length; i++) {
                                var sub_data = dataCoor[i]
                                var ctx = self.$el.find("#myCanvas")[0].getContext("2d");
                                ctx.beginPath();
                                ctx.strokeStyle = 'black';
                                ctx.lineWidth = 6;
                                ctx.lineJoin = "round";
                                ctx.moveTo(sub_data[0], sub_data[1]);
                                ctx.lineTo(sub_data[2], sub_data[3]);
                                ctx.closePath();
                                ctx.stroke();
                            }
                        }
                    }
                })

                // For Getting Main Appointment
                rpc.query({
                    model: 'medical.appointment',
                    method: 'search_read',
                    domain: [
                        ['id', '=', parseInt(this.appointment_id)],
                    ],
                }).then(function(data) {
                    console.log("==========MAIN DATA=============", data, data[0])
                    if (data) {
                        if (data[0].treatment_note) {
                            $('#treatment_note').val(data[0].treatment_note)
                            $("#treatment_note").attr("disabled", "disabled");
                        }
                        if (data[0].treatment_body_note) {
                            $('#treatment_body_note').val(data[0].treatment_body_note)
                            $("#treatment_body_note").attr("disabled", "disabled");
                        }
                    }
                });

                // For Getting Body Chart
                rpc.query({
                    model: 'medical.body.markers.history',
                    method: 'search_read',
                    domain: [
                        ['appointment_id', '=', parseInt(this.appointment_id)],
                    ],
                }).then(function(data) {
                    for (var k = 0; k < data.length; k++) {
                        var strCoordinate = data[k]['name']
                        var singleArray = strCoordinate.replace(/'/g, '"');
                        var dataCoor = JSON.parse(singleArray)
                        if (dataCoor) {
                            for (var i = 0; i < dataCoor.length; i++) {
                                var sub_data = dataCoor[i]
                                var ctxBody = self.$el.find("#myCanvasBody")[0].getContext("2d");
                                ctxBody.beginPath();
                                ctxBody.strokeStyle = 'black';
                                ctxBody.lineWidth = 6;
                                ctxBody.lineJoin = "round";
                                ctxBody.moveTo(sub_data[0], sub_data[1]);
                                ctxBody.lineTo(sub_data[2], sub_data[3]);
                                ctxBody.closePath();
                                ctxBody.stroke();
                            }
                        }
                    }
                })

                // For Getting Face Order Lines
                rpc.query({
                    model: 'face.order.line',
                    method: 'search_read',
                    domain: [
                        ['appointment_id', '=', parseInt(this.appointment_id)],
                    ],
                }).then(function(data){
                    console.log("=====face.order.line=======DATA=======",data)

                    for (var i = 0; i < data.length; i++) {
                        var newRow = $("<tr>")
                        var cols = ""
                        var productSelect = '<select disabled="disabled" class="form-control productFaceRow">'
                        productSelect += '<option value="">Select Material</option>'
                        if(self.products){
                            for (var k = 0; k < self.products.length; k++){
                                if(self.products[k].id == data[i].product_id[0]){
                                    productSelect = productSelect + '<option selected="selected" value="' + self.products[k].id + '">' + self.products[k].name + '</option>'
                                }
                                else{
                                    productSelect = productSelect + '<option value="' + self.products[k].id + '">' + self.products[k].name + '</option>'
                                }
                            }
                        }
                        productSelect += "</select>"
                        cols += '<td>' + productSelect +'</td>';
                        cols += '<td><input readonly="readonly" type="number" class="form-control inputQauntity" name="quantity" value="'+ data[i].quantity +'"/></td>';
                        cols += '<td><input readonly="readonly" type="number" class="form-control inputUnitPrice" name="unit_price" value="'+ data[i].unit_price +'"/></td>';
                        cols += '<td><input readonly="readonly" type="number" class="form-control" name="subtotal" readonly="readonly" value="'+ data[i].quantity*data[i].unit_price +'"/></td>';
                        cols += '<td><i class="fa fa-trash mt-2 delFaceRow d-none" style="color: red;font-size: 16px;cursor: pointer;"></i></td>';
                        newRow.append(cols)
                        $("#faceMaterialTable").append(newRow)
                        console.log("=========addBodyMaterial=============",$("#addBodyMaterial"))
                        $("#addFaceMaterial").addClass("d-none");
                    }
                    self._calculationSubtotal(self)
                })


                // For Getting Body Order Lines
                rpc.query({
                    model: 'body.order.line',
                    method: 'search_read',
                    domain: [
                        ['appointment_id', '=', parseInt(this.appointment_id)],
                    ],
                }).then(function(data){
                    console.log("=====face.order.line=======DATA=======",data)

                    for (var i = 0; i < data.length; i++) {
                        var newRow = $("<tr>")
                        var cols = ""
                        var productSelect = '<select disabled="disabled" class="form-control productBodyRow">'
                        productSelect += '<option value="">Select Material</option>'
                        if(self.products){
                            for (var k = 0; k < self.products.length; k++){
                                if(self.products[k].id == data[i].product_id[0]){
                                    productSelect = productSelect + '<option selected="selected" value="' + self.products[k].id + '">' + self.products[k].name + '</option>'
                                }
                                else{
                                    productSelect = productSelect + '<option value="' + self.products[k].id + '">' + self.products[k].name + '</option>'
                                }
                            }
                        }
                        productSelect += "</select>"
                        cols += '<td>' + productSelect +'</td>';
                        cols += '<td><input readonly="readonly" type="number" class="form-control inputQauntityBody" name="quantity" value="'+ data[i].quantity +'"/></td>';
                        cols += '<td><input readonly="readonly" type="number" class="form-control inputUnitPriceBody" name="unit_price" value="'+ data[i].unit_price +'"/></td>';
                        cols += '<td><input readonly="readonly" type="number" class="form-control" name="subtotal" readonly="readonly" value="'+ data[i].quantity*data[i].unit_price +'"/></td>';
                        cols += '<td><i class="fa fa-trash mt-2 delBodyRow d-none" style="color: red;font-size: 16px;cursor: pointer;"></i></td>';
                        newRow.append(cols)
                        $("#bodyMaterialTable").append(newRow)
                        $("#addBodyMaterial").addClass("d-none");
                    }
                    self._calculationSubtotalBody(self)
                })


            }
            return def
        },

        renderElement: function() {
            this._super()
            var self = this;
        }

    });

    core.action_registry.add('face_body_chart', FaceBodyChartView);
    return {
        FaceBodyChartView: FaceBodyChartView,
    };




});
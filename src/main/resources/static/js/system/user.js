"use strict";
define([
    "jquery",
    "vue",
    "datatables",
    "bootstrap",
    "common-module",
    'jquery-validate',
    'validate-extend'
], function ($, Vue, DataTables, bootstrap, common_module, jquery_validate, validate_extend) {
    if($("#system_user")[0]){
        var userVue = new Vue({
            el:"#system_user",
            data: {
                userInfos: [],
                roleInfos: [],
                userTableObj: null,
                editUser: {
                    userName: '',
                    password: '',
                    role_name: '',
                    email:'',
                    telephone: ''
                },
                password_edit: ''
            },
            mounted: function () {
                $(".loading").css('display','block');
                var _self = this;
                _self.getUserData();
                Vue.nextTick(function () {
                    _self.userTableObj = common_module.dataTables("#user_table");
                });
                setTimeout(function () {
                    $(".loading").css('display','none');
                }, 1000);
            },
            methods: {
                checkAll: function (event) {
                    var id = $(event.target).parents('table').attr("id");
                    common_module.checkAll("#" + id);
                },
                checkOne: function (event) {
                    common_module.checkOne(event);
                },
                getUserData: function () {
                    var _self = this;
                    $.ajax({
                        url: '../user/info',
                        type: 'get',
                        dataType: 'json',
                        async: false,
                        success: function (data) {
                            if (data.code === 'success') {
                                _self.userInfos = data.data;
                                console.log(data.data);
                                common_module.notify('[用户]', '获取用户数据成功', 'success');
                            } else {
                                common_module.notify('[用户]', '获取用户数据失败', 'danger');
                            }
                        },
                        error: function () {
                            common_module.notify('[用户]', '获取用户数据失败', 'danger');
                        }
                    });
                },

                getRole: function () {
                    var _self = this;
                    $.ajax({
                        url: '../role/info',
                        type: 'get',
                        dataType: 'json',
                        async: false,
                        success: function (data) {
                            if (data.code === 'success') {
                                _self.roleInfos = data.data;
                                console.log(data.data);
                                common_module.notify('[用户]', '获取角色数据成功', 'success');
                            } else {
                                common_module.notify('[用户]', '获取角色数据失败', 'danger');
                            }
                        },
                        error: function () {
                            common_module.notify('[用户]', '获取角色数据失败', 'danger');
                        }
                    });
                },

                refreshTable: function () {
                    var _self = this;
                    $(".loading").css('display','block');
                    if(_self.userTableObj != null) {
                        _self.userTableObj.destroy();
                    }
                    _self.getUserData();
                    Vue.nextTick(function () {
                        _self.userTableObj = common_module.dataTables("#user_table");
                    });
                    setTimeout(function () {
                        $(".loading").css('display','none');
                    },1000);
                },

                showAddDialog: function () {
                    var _self = this;
                    _self.getRole();
                    $("#add_user").modal({backdrop: 'static', keyboard: false});
                },

                submitAdd: function () {
                    var _self = this;
                    var test = $("#add_user_form").valid();
                    if(!test) {
                        return;
                    }
                    var formdata = new FormData();
                    formdata.append("userName", $("#add_user_form input[name='username']").val());
                    formdata.append("role_uuid", $("#add_user_form select").val());
                    formdata.append("password", $("#add_user_form input[name='password']").val());
                    formdata.append("email",$("#add_user_form input[name='email']").val());
                    formdata.append("telephone",$("#add_user_form input[name='telephone']").val());
                    $(".loading").css('display','block');
                    $.ajax({
                        url: '../user/add',
                        type: 'post',
                        data: formdata,
                        dataType: 'json',
                        processData: false,
                        contentType: false,
                        success: function (data) {
                            if(data.code == 'success') {
                                //销毁表格
                                if(_self.userTableObj != null) {
                                    _self.userTableObj.destroy();
                                }
                                _self.getUserData();
                                Vue.nextTick(function () {
                                    _self.userTableObj = common_module.dataTables("#user_table");
                                });
                                common_module.notify('[用户]', '添加用户成功', 'success');
                                $("#add_user").modal('hide');
                            } else {
                                common_module.notify('[用户]', '添加用户失败', 'danger');
                            }
                            setTimeout(function () {
                                $(".loading").css('display','none');
                            },1000);
                        },
                        error: function () {
                            common_module.notify('[用户]', '添加用户失败', 'danger');
                            setTimeout(function () {
                                $(".loading").css('display','none');
                            },1000);
                        }
                    });
                },

                showEditUser: function (userid) {
                    var _self = this;
                    _self.getRole();
                    for(var i = 0; i <_self.userInfos.length; i++) {
                        if(userid == _self.userInfos[i].user_uuid){
                            _self.editUser = _self.userInfos[i];
                            _self.password_edit = _self.editUser.password;
                            console.log(_self.editUser);
                            break;
                        }
                    }
                    $("#edit_user").modal({backdrop: 'static', keyboard: false});
                },

                submitEdit: function () {
                    var _self = this;
                    var formdata = new FormData();
                    formdata.append("user_uuid", _self.editUser.user_uuid);
                    formdata.append("userName", _self.editUser.userName);
                    formdata.append("role_uuid", _self.editUser.role_uuid);
                    // formdata.append("password", $("#edit_user_form input[name='password_edit']").val());
                    formdata.append("email",$("#edit_user_form input[name='email_edit']").val());
                    formdata.append("telephone",$("#edit_user_form input[name='telephone_edit']").val());
                    $(".loading").css('display','block');
                    $.ajax({
                        url: '../user/edit',
                        type: 'post',
                        data: formdata,
                        dataType: 'json',
                        processData: false,
                        contentType: false,
                        success: function (data) {
                            if(data.code == 'success') {
                                //销毁表格
                                if(_self.userTableObj != null) {
                                    _self.userTableObj.destroy();
                                }
                                _self.getUserData();
                                Vue.nextTick(function () {
                                    _self.userTableObj = common_module.dataTables("#user_table");
                                });
                                common_module.notify('[用户]', '修改用户'+ _self.editUser.userName +'成功', 'success');
                                $("#edit_user").modal('hide');
                            } else {
                                common_module.notify('[用户]', '修改用户'+_self.editUser.userName+'失败', 'danger');
                            }
                            setTimeout(function () {
                                $(".loading").css('display','none');
                            },1000);
                        },
                        error: function () {
                            common_module.notify('[用户]', '修改用户'+_self.editUser.userName+'失败', 'danger');
                            setTimeout(function () {
                                $(".loading").css('display','none');
                            },1000);
                        }
                    });
                },

                //包括单删和多删
                deleteByIds: function (event, type) {
                    var _self = this;
                    var ids = [];
                    if('one' === type) {
                        ids.push($(event.target).parents('tr').attr('id'));
                    } else if('multiple' === type) {
                        $("#user_table tbody").children('tr').each(function(index,element) {
                            var checkbox = $(element).find("input[type='checkbox']")[0];
                            if($(checkbox).prop("checked")) {
                                ids.push($(element).attr('id'));
                            }
                        });
                    }
                    if(ids.length === 0){
                        common_module.notify('[用户]', '请选择要删除的用户', 'danger');
                        return;
                    }
                    $(".loading").css('display','block');
                    $.ajax({
                        url: '../user/delete',
                        type: 'post',
                        data: {
                            ids: ids
                        },
                        dataType: 'json',
                        success: function (data) {
                            if(data.code == "success"){
                                //销毁表格
                                if(_self.userTableObj != null) {
                                    _self.userTableObj.destroy();
                                }
                                _self.getUserData();
                                Vue.nextTick(function () {
                                    _self.userTableObj = common_module.dataTables("#user_table");
                                });
                                console.log(data.data);
                                if(data.data.success == ids.length) {
                                    common_module.notify('[用户]',
                                        "删除用户成功" + data.data.success + "个，失败" + data.data.fail + "个", 'success');
                                } else {
                                    common_module.notify('[用户]',
                                        "删除用户成功" + data.data.success  +"个，失败" + data.data.fail + "个", 'warning');
                                }
                            } else {
                                common_module.notify('[用户]',"删除用户失败", 'danger');
                            }
                            setTimeout(function () {
                                $(".loading").css('display','none');
                            },1000);
                        },
                        error: function () {
                            common_module.notify('[用户]',"删除用户失败", 'danger');
                            setTimeout(function () {
                                $(".loading").css('display','none');
                            },1000);
                        }
                    })
                }
            }
        });

        var validator = $("#add_user_form").validate({
            submitHandler: function(form){
                debugger
                // userVue.submitAdd();
            },
            ignore: "",
            errorElement:'div',
            onkeyup: false,
            rules: {
                username:{
                    required: true,
                    notEmpty: true,
                    userNameUnique: true
                },
                password: {
                    required: true,
                    notEmpty: true
                },
                passwordAgain:{
                    required: true,
                    notEmpty: true,
                    sameToPsd: true
                },
                email:{
                    required: true,
                    notEmpty: true,
                    email: true
                },
                telephone:{
                    required: true,
                    notEmpty: true,
                    phone: true
                }
            },
            messages: {
                email: {
                    email:"邮箱格式不正确"
                }
            },
            errorPlacement: function (error, element) {
                error.appendTo(element.parent());
            }
        });

        $('#add_user').on('hide.bs.modal', function () {
            $("#add_user_form input").val("");
            $("#add_user_form select").val("");
        });
    }
});
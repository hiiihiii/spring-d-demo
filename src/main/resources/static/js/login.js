"use strict";
define([
    'jquery',
    "vue",
    "common-module",
    "bootstrap",
    'jquery-validate',
    'validate-extend'
], function ($, Vue, common_module, bootstrap, jquery_validate, validate_extend) {
    if($(".login-box")[0]){
        var loginbox = new Vue({
            el: ".login-box",
            data: {

            },
            methods: {
                loginSubmit: function () {
                    var user = {
                        username: $("#login-form #username").val(),
                        password: $("#login-form #loginPsd").val()
                    };
                    $.ajax({
                        type: "post",
                        data: user,
                        url: "/login",
                        dataType: "json",
                        content_type: "application/json",
                        success: function (data) {
                            if("success" === data.code){
                                var user = data.data;
                                // if(user.role_name ==="admin_user") { //云管理员
                                window.location.href = "/adminhomepage";
                                sessionStorage.currentMenu= "概览";
                                sessionStorage.href= '/adminhomepage';
                                // } else {
                                //     window.location.href = "/";
                                // }
                            } else {

                            }
                            console.log(data.data);
                        },
                        error: function () {
                            console.log("error");
                        }
                    });
                }
            }
        });
        //验证
        var validator = $("#login-form").validate({
            submitHandler: function(form){
                if($(form).valid()){
                    loginbox.loginSubmit();
                }
            },
            rules: {
                username: {
                    required: true,
                    notEmpty: true
                },
                loginPsd: {
                    required: true
                }
            },
            messages: {}
        });
    }

});
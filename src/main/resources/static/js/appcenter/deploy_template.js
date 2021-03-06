"use strict";
define([
    'jquery',
    'vue',
    'bootstrap',
    'jquery-validate',
    'validate-extend',
    "common-module"
], function ($, Vue, bootstrap, bootstrapSwitch, jquery_validate, validate_extend,common_module) {
    if($("#deploy_template")[0]){
        var deployTemplate = new Vue({
            el: '#deploy_template',
            data: {
                infoTag: "baseInfo",
                nextStep: true,
                previousStep: false,
                submitTag: false,
                deployTemplateObj: {
                    templateName: "",
                    appType: '',
                    config: [],
                    relation: {}
                }
            },
            mounted: function () {

            },
            methods: {
                //上一步
                toPrevious: function () {
                    var _self = this;
                    if(_self.infoTag == 'resourceInfo'){
                        _self.infoTag = 'baseInfo';
                        _self.previousStep = false;
                        _self.nextStep = true;
                    } else if(_self.infoTag == 'configInfo'){
                        _self.infoTag = 'resourceInfo';
                        _self.previousStep = true;
                        _self.nextStep = true;
                    }
                    if(_self.infoTag == 'configInfo'){
                        _self.submitTag = true;
                    } else {
                        _self.submitTag = false;
                    }
                },

                //下一步
                toNext:function () {
                    var _self = this;
                    if(_self.infoTag == 'baseInfo'){
                        _self.infoTag = 'resourceInfo';
                        _self.previousStep = true;
                        _self.nextStep = true;
                    } else if(_self.infoTag == 'resourceInfo'){
                        _self.infoTag = 'configInfo';
                        _self.previousStep = true;
                        _self.nextStep = false;
                    }
                    if(_self.infoTag == 'configInfo'){
                        _self.submitTag = true;
                    } else {
                        _self.submitTag = false;
                    }
                },

                //初始化数据
                initData: function () {
                    var _self = this;
                    for(var i = 0; i < _self.deployTemplateObj.config.length; i++){
                        //调整 运行环境 格式
                        var requests = _self.deployTemplateObj.config[i].metadata.requests;
                        _self.deployTemplateObj.config[i].metadata.requests = {
                            cpu: requests.cpu,
                            memory: requests.memory.slice(0, requests.memory.length - 2),
                            memoryUnit: requests.memory.slice(requests.memory.length - 2, requests.memory.length)
                        };
                        var limits = _self.deployTemplateObj.config[i].metadata.limits;
                        _self.deployTemplateObj.config[i].metadata.limits = {
                            cpu: limits.cpu,
                            memory: limits.memory.slice(0, limits.memory.length - 2),
                            memoryUnit: limits.memory.slice(limits.memory.length - 2, limits.memory.length)
                        };
                        var name = _self.deployTemplateObj.config[i].appName;
                        $("#deploy_template #" + name + "cmdParam-box" + " .cmdParam-item").remove();
                        $("#deploy_template #" + name + "env_table tbody tr").remove();
                        $("#deploy_template #" + name + "port_table tbody tr").remove();
                        var cmdParams = _self.deployTemplateObj.config[i].metadata.cmdParams;
                        _self.addCmdParam(name, cmdParams);
                        var env = _self.deployTemplateObj.config[i].metadata.env;
                        _self.addEnv(name, env);
                        var ports = _self.deployTemplateObj.config[i].metadata.ports;
                        _self.addPort(name, ports, 'js');
                    }
                },

                //增加命令参数
                addCmdParam: function (appName, cmdParamArray) {
                    cmdParamArray = cmdParamArray || [''];
                    for(var i = 0; i < cmdParamArray.length; i++) {
                        var cmdParam = cmdParamArray[i];
                        var cmdParamStr =
                            '<div class="cmdParam-item">' +
                            '<input class="form-control" type="text" name="cmdParam" value="'+ cmdParam +'" />' +
                            '<span class="delete-cmd-btn"><i class="fa fa-trash-o"></i></span>'+
                            '</div>';
                        var id = "#deploy_template #" + appName + "cmdParam-box";
                        var cmdParam_box = $(id);
                        cmdParam_box.append(cmdParamStr);
                        var cmdParam_items = cmdParam_box.find(".delete-cmd-btn");
                        $(cmdParam_items[cmdParam_items.length-1]).on("click", function () {
                            $(this).parent().remove();
                        });
                    }
                },

                //增加环境变量
                addEnv: function (appName, envObj) {
                    if(envObj.length==0){
                        envObj = [{name:'', value: ''}];
                    }
                    for(var i = 0; i < envObj.length; i++){
                        var envStr =
                            '<tr>' +
                            '<td><label>'+ envObj[i].name +'</label></td>' +
                            // '<td><input class="form-control" type="text" value="'+ envObj[i].name +'" name="envKey" /></td>' +
                            '<td><input class="form-control" type="text" value="' + envObj[i].value + '" name="envValue" /></td>' +
                            '<td><span class="modal-table-operation"><i class="fa fa-trash-o"></i></span></td>' +
                            '</tr>';
                        var id = "#deploy_template #" + appName + "env_table tbody";
                        var envTbody = $(id);
                        envTbody.append(envStr);
                        var trs = envTbody.find("tr");
                        $(trs[trs.length-1]).on("click", ".modal-table-operation", function () {
                            /*detach方法可以删除绑定的事件，而remove能*/
                            $(this).parents("tr").remove();
                        });
                    }
                },

                //增加端口映射
                addPort: function (appName, portObj, source) {
                    if(portObj.length == 0 ){
                        portObj = [{portName:'', protocol:'TCP',containerPort:'',port:'',nodePort:''}];
                    }
                    for(var i = 0; i < portObj.length; i++){
                        var portStr = '<tr>' +
                            // '<td><input class="form-control" type="text" value="' + portObj[i].portName + '" name="portName"/></td>' +
                            '<td><label>' + portObj[i].portName + '</label></td>' +
                            '<td>' +
                            '<select class="form-control" name="protocol" value="' + portObj[i].protocol + '">' +
                            '<option value="TCP">TCP</option>' +
                            '<option value="UDP">UDP</option>' +
                            '</select>' +
                            '</td>' +
                            '<td><input class="form-control" type="text" maxlength="5" value="'+portObj[i].containerPort+'" name="containerPort"/></td>' +
                            '<td><input class="form-control" type="text" maxlength="5" value="'+portObj[i].port+'" name="port"/></td>' +
                            '<td><input class="form-control" type="text" maxlength="5" value="'+portObj[i].nodePort+'" name="nodePort"/></td>';
                        if(source === 'js' && i === 0){
                            portStr += '</tr>';
                        } else {
                            portStr +=
                                '<td><span class="modal-table-operation"><i class="fa fa-trash-o"></i></span></td>' +
                                '</tr>';
                        }
                        var id = "#deploy_template #" + appName + "port_table tbody";
                        var portTbody = $(id);
                        portTbody.append(portStr);
                        var trs = portTbody.find("tr");
                        $(trs[trs.length-1]).on("click", ".modal-table-operation", function () {
                            /*detach方法不能删除绑定的事件，而remove能*/
                            $(this).parents("tr").remove();
                        });
                    }
                },

                submitDeployTemplate: function (event) {
                    var _self = this;
                    var formdata = new FormData();
                    var template = JSON.parse(sessionStorage.getItem("deployTemplate"));
                    //公有字段
                    var deployName = $("#deploy_template_form input[name='deployName']").val();
                    formdata.append("deploy_name", deployName);
                    formdata.append("deploy_type", "template");
                    formdata.append("description", $("#deploy_template_form textarea[name='description']").val());
                    formdata.append("app_id", template.uuid);
                    formdata = _self.generateMetadata(formdata, template);
                    $(".loading").css("display","block");
                    $.ajax({
                        type: "post",
                        url: "../appcenter/template/deploy",
                        data: formdata,
                        dataType: "json",
                        processData: false,
                        contentType: false,
                        success: function (data) {
                            if(data.code === 'success') {
                                common_module.notify("[应用中心]",'部署应用模板'+template.templateName+'成功，部署名称为'+deployName,'success');
                                $("#deploy_template").modal('hide');
                                //跳转
                                window.location.href="../application/";
                                sessionStorage.href = "/application";
                            } else {
                                common_module.notify("[应用中心]",'部署应用模板'+'失败','danger');
                            }
                            setTimeout(function () {
                                $(".loading").css("display","none");
                            }, 1000);
                        },
                        error: function () {
                            common_module.notify("[应用中心]",'部署应用模板'+'失败','danger');
                            setTimeout(function () {
                                $(".loading").css("display","none");
                            }, 1000);
                        }
                    });
                },

                generateMetadata: function (formdata, template) {
                    var containers = [];
                    for(var i = 0; i < template.config.length; i++) {
                        var container = {};
                        var imageName = template.config[i].appName;
                        var configTabId = "config" + imageName;
                        var resourceTab = "resource" + imageName;
                        container.imageName = imageName;
                        container.image_source_url = template.config[i].source_url;
                        container.limits = {
                            "cpu": $("#" + resourceTab + " input[name='maxcpu']").val(),
                            "memory": $("#" + resourceTab + " input[name='maxMemory']").val() + $("#" + resourceTab + " select[name='maxMemoryUnit']").val()
                        };
                        container.requests = {
                                "cpu": $("#" + resourceTab + " input[name='mincpu']").val(),
                                "memory": $("#" + resourceTab + " input[name='minMemory']").val() + $("#" + resourceTab + " select[name='minMemoryUnit']").val()
                            };
                        container.serviceName = $("#" + configTabId + " input[name='serviceName']").val();
                        container.replicas = $("#" + configTabId + " input[name='instanceCount']").val();
                        container.workingDir = $("#" + configTabId + " input[name='volumeDir']").val();
                        container.command = $("#" + configTabId + " input[name='cmd']").val().split(",");
                        container.args = [];
                        $("#" + configTabId).find("input[name='cmdParam']").each(function (index, ele) {
                            var value = $(ele).val();
                            if(value){
                                container.args.push(value);
                            }
                        });
                        container.env = [];
                        $("#" + configTabId + " #" + imageName + "env_table tbody").find("tr").each(function (index, ele) {
                            var temp = {};
                            temp.name = $($(ele).find("input[name='envKey']")[0]).val();
                            temp.value = $($(ele).find("input[name='envValue']")[0]).val();
                            container.env.push(temp);
                        });
                        container.ports = [];
                        $("#" + configTabId + " #" + imageName + "port_table tbody").find("tr").each(function (index, ele) {
                            var port = {};
                            port.name = $($(ele).find("label")[0]).text();
                            port.nodePort = $($(ele).find("input[name='nodePort']")[0]).val();
                            port.port = $($(ele).find("input[name='port']")[0]).val();
                            port.protocol = $($(ele).find("select[name='protocol']")[0]).val();
                            port.targetPort = $($(ele).find("input[name='containerPort']")[0]).val();
                            container.ports.push(port);
                        });
                        containers.push(container);
                    }
                    formdata.append("containers", JSON.stringify(containers));
                    return formdata;
                }
            }
        });

        $('#deploy_template').on('show.bs.modal', function () {
            var templateInfo = JSON.parse(sessionStorage.getItem("deployTemplate"));
            deployTemplate.deployTemplateObj.templateName = templateInfo.templateName;
            deployTemplate.deployTemplateObj.appType = templateInfo.appType;
            deployTemplate.deployTemplateObj.config = templateInfo.config;
            deployTemplate.deployTemplateObj.relation = templateInfo.relation;
            Vue.nextTick(function () {
                deployTemplate.initData();
            });
        });
    }

    var validator = $("#deploy_template_form").validate({
        submitHandler: function(form){
            if($(form).valid()){
                deploy_image.submitDeployImage();
            }
        },
        ignore: "",
        onkeyup: false,
        rules: {
            deployName: {
                required: true,
                notEmpty: true,
                deployUnique: true
            },
            mincpu:{
                required: true,
                notEmpty: true
            },
            minMemory:{
                required: true,
                notEmpty: true
            },
            maxcpu:{
                required: true,
                notEmpty: true
            },
            maxMemory:{
                required: true,
                notEmpty: true
            },
            serviceName:{
                required: true,
                notEmpty: true
            },
            instanceCount:{
                required: true,
                notEmpty: true
            },
            portName:{
                required: true,
                notEmpty: true
            },
            containerPort:{
                required: true,
                notEmpty: true
            },
            port:{
                required: true,
                notEmpty: true
            },
            protocol:{
                required: true,
                notEmpty: true
            },
            nodePort:{
                required: true,
                notEmpty: true
            }
        },
        messages: { },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent());
        }
    });
});
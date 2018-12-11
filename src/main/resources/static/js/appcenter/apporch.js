/**
 * Created by tanli on 2018/7/10 0010.
 */
"use strict"
define([
    'jquery',
    "vue",
    "echarts",
    "common-module",
    "bootstrap",
    "bootstrapSwitch",
    "select2",
    "datatables"
], function ($, Vue, echarts, common_module, bootstrap, bootstrapSwitch, select2, DataTables) {
    if($("#apporch")[0]){
        var orchVue = new Vue({
            el: "#apporch",
            data:{
                templateList: []
            },
            mounted: function(){
                var _self = this;
                _self.getTemplate();
                Vue.nextTick(function () {
                    common_module.dataTables("#template_table");
                });
            },
            methods: {
                getTemplate: function () {
                    var _self = this;
                    $.ajax({
                        url: "../apporch/templateinfo",
                        type: "get",
                        async: false,
                        dataType: "json",
                        success: function(data){
                            if(data.code === "success"){
                                _self.templateList = _self.convertData(data.data);
                                console.log(_self.templateList);
                                common_module.notify("[应用编排]", "获取模板信息成功","success");
                            } else{
                                common_module.notify("[应用编排]", "获取模板信息成功","success");
                            }
                        },
                        error: function () {
                            common_module.notify("[应用编排]", "获取模板信息成功","success");
                        }
                    });
                },
                toDetail: function (event) {
                    var id = $(event.target).attr("id");
                    sessionStorage.setItem("templateId", id);
                    //在新页面打开
                    window.open('../apporch/templatedetail')
                },
                convertData: function (templateArray) {
                    for(var i = 0; i < templateArray.length; i++){
                        templateArray[i].relation = JSON.parse(templateArray[i].relation);
                        templateArray[i].config = JSON.parse(templateArray[i].config);
                        templateArray[i].temp_logo_url = "ftp://docker:dockerfile@" + templateArray[i].logo_url;
                    }
                    return templateArray;
                },
                publishTemplate: function (templateId, templateName) {
                    console.log(templateId);
                    var _self = this;
                    $.ajax({
                        url: "../apporch/publish",
                        type: "post",
                        data: {
                            templateId: templateId
                        },
                        dataType: 'json',
                        success: function (data) {
                            if(data.code == 'success'){
                                common_module.notify('[应用编排]','发布镜像' + templateName + '成功','success');
                                // _self.getTemplate();
                            } else {
                                common_module.notify('[应用编排]','发布镜像' + templateName + '失败','danger');
                            }
                        },
                        error: function () {
                            common_module.notify('[应用编排]','发布镜像' + templateName + '失败','danger');
                        }
                    });
                }
            }
        });
    }
});

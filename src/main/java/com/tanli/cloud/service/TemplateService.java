package com.tanli.cloud.service;

import com.tanli.cloud.model.response.LoginingUser;
import com.tanli.cloud.utils.APIResponse;

/**
 * Created by tanli on 2018/12/6 0006.
 */
public interface TemplateService {
    public APIResponse getTemplate(LoginingUser user);
}
package com.tanli.cloud.service;

import com.tanli.cloud.model.response.User;
import com.tanli.cloud.utils.APIResponse;

/**
 * Created by tanli on 2018/12/6 0006.
 */
public interface TemplateService {
    public APIResponse getTemplate(User user);
    public APIResponse getTemplateDetail(User user, String templateId);
    public APIResponse publishTemplate(User user, String templateId);
    public APIResponse deleteByIds(User user, String[] ids);
}

package com.tanli.cloud.service;

import com.tanli.cloud.model.response.User;
import com.tanli.cloud.utils.APIResponse;

/**
 * Created by tanli on 2018/10/15 0015.
 */
public interface UserManageService {
    public User loginVerify(User user);
    public APIResponse getUsers(User user);
    public APIResponse addUser(User user);
    public APIResponse editUser(User user, User editUser);
    public APIResponse deleteByIds(User user, String[] ids);
    public APIResponse checkUserName(String username);
}

package com.tanli.cloud.service;

import com.tanli.cloud.constant.EnvConst;
import com.tanli.cloud.dao.RepositoryDao;
import com.tanli.cloud.dao.UserDao;
import com.tanli.cloud.dao.UserLogDao;
import com.tanli.cloud.model.UserLog;
import com.tanli.cloud.model.response.Repository;
import com.tanli.cloud.model.response.User;
import com.tanli.cloud.utils.APIResponse;
import com.tanli.cloud.utils.UuidUtil;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by tanli on 2018/10/15 0015.
 */
@Service
public class UserManageServiceImp implements UserManageService {

    @Autowired
    private UserDao userDao;
    @Autowired
    private UserLogDao userLogDao;
    @Autowired
    private RepositoryDao repositoryDao;

    private static final org.slf4j.Logger LOGGE = org.slf4j.LoggerFactory.getLogger(UserManageServiceImp.class);

    @Override
    public User loginVerify(User user) {
        //操作日志
        DateTime now = DateTime.now();
        String nowStr = now.getYear()+"-"+now.getMonthOfYear()+"-"+now.getDayOfMonth()+" "+ now.getHourOfDay() + ":"+now.getMinuteOfHour()+":"+now.getSecondOfMinute();
        UserLog userLog = new UserLog();
        userLog.setUuid(UuidUtil.getUUID());
        userLog.setUsername(user.getUserName());
        userLog.setResoureType("User");
        userLog.setOperation("登录");
        userLog.setIsDeleted("0");
        userLog.setCreate_time(nowStr);

        User login_user = userDao.loginVefiry(user);
        userLog.setUser_id(login_user.getUser_uuid());
        userLog.setResourceId(login_user.getUser_uuid());
        userLogDao.addUserLog(userLog);
        return login_user;
    }

    @Override
    public APIResponse getUsers(User user) {
        try {
            List<User> users = userDao.getAllUser();
            return APIResponse.success(users);
        } catch (Exception e) {
            LOGGE.info("[UserManageServiceImp Info]: " + "获取用户数据失败");
            return APIResponse.fail("获取用户数据失败");
        }
    }

    @Override
    public APIResponse addUser(User user) {
        user.setUser_uuid(UuidUtil.getUUID());
        DateTime now = DateTime.now();
        String nowStr = now.getYear()+"-"+now.getMonthOfYear()+"-"+now.getDayOfMonth()+" "+ now.getHourOfDay() + ":"+now.getMinuteOfHour()+":"+now.getSecondOfMinute();
        user.setCreate_time(nowStr);
        user.setUpdate_time(nowStr);
        Repository repository =new Repository();
        repository.setRepo_uuid(UuidUtil.getUUID());
        repository.setUser_uuid(user.getUser_uuid());
        repository.setRepo_name(user.getUserName()+"_project");
        repository.setRepo_type("private");
        repository.setUrl("http"+ EnvConst.harbor_api_ip);
        //repository.set
        repository.setCreate_time(nowStr);
        repository.setUpdate_time(nowStr);

        //调用Harbor API创建project
        //在Kubernetes中为用户创建命名空间
        //将仓库信息保存到数据库中
        try {
            //操作日志
            UserLog userLog = new UserLog();
            userLog.setUuid(UuidUtil.getUUID());
            userLog.setUser_id(user.getUser_uuid());
            userLog.setUsername(user.getUserName());
            userLog.setResoureType("User");
            userLog.setResourceId(user.getUser_uuid());
            userLog.setOperation("增加用户");
            userLog.setIsDeleted("0");
            userLog.setCreate_time(nowStr);
            userLogDao.addUserLog(userLog);
            int count = userDao.addUser(user);
            if(count > 0){
                return APIResponse.success();
            } else {
                LOGGE.info("[UserManageServiceImp Info]: " + "增加用户失败");
            }
        } catch (Exception e) {
            LOGGE.info("[UserManageServiceImp Info]: " + "增加用户失败");
            e.printStackTrace();
        }
        return APIResponse.fail("增加用户失败");
    }

    @Override
    public APIResponse deleteByIds(User user, String[] ids) {
        Map<String, Integer> result = new HashMap<>();
        int success = 0, fail = 0;
        for(int i = 0 ; i < ids.length; i++){
            try {
                //操作日志
                DateTime now = DateTime.now();
                String nowStr = now.getYear()+"-"+now.getMonthOfYear()+"-"+now.getDayOfMonth()+" "+ now.getHourOfDay() + ":"+now.getMinuteOfHour()+":"+now.getSecondOfMinute();
                UserLog userLog = new UserLog();
                userLog.setUuid(UuidUtil.getUUID());
                userLog.setUser_id(user.getUser_uuid());
                userLog.setUsername(user.getUserName());
                userLog.setResoureType("User");
                userLog.setResourceId(ids[i]);
                userLog.setOperation("删除用户");
                userLog.setIsDeleted("0");
                userLog.setCreate_time(nowStr);
                userLogDao.addUserLog(userLog);

                int count = userDao.deleteById(ids[i]);
                if(count > 0){
                    success += 1;
                } else {
                    fail += 1;
                    LOGGE.info("[UserManageServiceImp Info]: " + "删除用户" + ids[i] + "失败");
                }
            } catch (Exception e) {
                fail += 1;
                LOGGE.info("[UserManageServiceImp Info]: " + "删除用户" + ids[i] + "失败");
                e.printStackTrace();
            }
        }
        result.put("success", success);
        result.put("fail", fail);
        if(fail == ids.length) {
            return APIResponse.fail("删除用户失败");
        }
        return APIResponse.success(result);
    }

    private Boolean addHarborProject(String projectName) {
        Boolean result = false;
        return result;
    }
}

package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.ModifyLog;
import cn.enilu.flash.dao.legalperson.ModifyLogRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ModifyLogService extends BaseService<ModifyLog,Long,ModifyLogRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private ModifyLogRepository modifyLogRepository;

}


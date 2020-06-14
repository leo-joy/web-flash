package cn.enilu.flash.service.system;


import cn.enilu.flash.bean.entity.system.InterfaceManage;
import cn.enilu.flash.dao.system.InterfaceManageRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InterfaceManageService extends BaseService<InterfaceManage,Long,InterfaceManageRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private InterfaceManageRepository interfaceManageRepository;

}


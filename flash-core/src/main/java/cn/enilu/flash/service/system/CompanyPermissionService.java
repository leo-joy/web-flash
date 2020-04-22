package cn.enilu.flash.service.system;


import cn.enilu.flash.bean.entity.system.CompanyPermission;
import cn.enilu.flash.dao.system.CompanyPermissionRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompanyPermissionService extends BaseService<CompanyPermission,Long,CompanyPermissionRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private CompanyPermissionRepository companyPermissionRepository;

}


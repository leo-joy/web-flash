package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.AdministrativeLicense;
import cn.enilu.flash.dao.legalperson.AdministrativeLicenseRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdministrativeLicenseService extends BaseService<AdministrativeLicense,Long,AdministrativeLicenseRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private AdministrativeLicenseRepository administrativeLicenseRepository;

}


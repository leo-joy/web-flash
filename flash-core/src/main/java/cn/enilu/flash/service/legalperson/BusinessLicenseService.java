package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.BusinessLicense;
import cn.enilu.flash.dao.legalperson.BusinessLicenseRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusinessLicenseService extends BaseService<BusinessLicense,Long,BusinessLicenseRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private BusinessLicenseRepository businessLicenseRepository;

    public List getCompanysByRoleIds(List<Long> roleList) {
        List companys = businessLicenseRepository.getCompanysByRoleIds(roleList);
        return companys;

    }

}


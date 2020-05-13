package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.CompanyModify;
import cn.enilu.flash.dao.legalperson.CompanyModifyRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompanyModifyService extends BaseService<CompanyModify,Long,CompanyModifyRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private CompanyModifyRepository companyModifyRepository;
}


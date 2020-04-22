package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.BranchCompany;
import cn.enilu.flash.dao.legalperson.BranchCompanyRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BranchCompanyService extends BaseService<BranchCompany,Long,BranchCompanyRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private BranchCompanyRepository branchCompanyRepository;

}


package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.InvestCompany;
import cn.enilu.flash.dao.legalperson.InvestCompanyRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InvestCompanyService extends BaseService<InvestCompany,Long,InvestCompanyRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private InvestCompanyRepository investCompanyRepository;

}


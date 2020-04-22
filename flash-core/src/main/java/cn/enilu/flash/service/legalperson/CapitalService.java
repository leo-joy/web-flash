package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.Capital;
import cn.enilu.flash.dao.legalperson.CapitalRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CapitalService extends BaseService<Capital,Long,CapitalRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private CapitalRepository capitalRepository;

}


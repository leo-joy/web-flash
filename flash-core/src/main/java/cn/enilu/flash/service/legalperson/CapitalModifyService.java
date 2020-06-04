package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.CapitalModify;
import cn.enilu.flash.dao.legalperson.CapitalModifyRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CapitalModifyService extends BaseService<CapitalModify,Long,CapitalModifyRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private CapitalModifyRepository capitalModifyRepository;

}


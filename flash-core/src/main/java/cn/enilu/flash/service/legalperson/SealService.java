package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.Seal;
import cn.enilu.flash.dao.legalperson.SealRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SealService extends BaseService<Seal,Long,SealRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private SealRepository sealRepository;

}


package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.Annals;
import cn.enilu.flash.dao.legalperson.AnnalsRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnnalsService extends BaseService<Annals,Long,AnnalsRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private AnnalsRepository annalsRepository;

}


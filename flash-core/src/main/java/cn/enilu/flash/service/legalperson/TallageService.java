package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.Tallage;
import cn.enilu.flash.dao.legalperson.TallageRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TallageService extends BaseService<Tallage,Long,TallageRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private TallageRepository tallageRepository;

}


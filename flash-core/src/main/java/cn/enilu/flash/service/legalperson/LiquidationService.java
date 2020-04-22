package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.Liquidation;
import cn.enilu.flash.dao.legalperson.LiquidationRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LiquidationService extends BaseService<Liquidation,Long,LiquidationRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private LiquidationRepository liquidationRepository;

}


package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.StockPledge;
import cn.enilu.flash.dao.legalperson.StockPledgeRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StockPledgeService extends BaseService<StockPledge,Long,StockPledgeRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private StockPledgeRepository stockPledgeRepository;

}


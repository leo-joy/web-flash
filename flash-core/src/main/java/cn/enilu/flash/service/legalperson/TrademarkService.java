package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.Trademark;
import cn.enilu.flash.dao.legalperson.TrademarkRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TrademarkService extends BaseService<Trademark,Long,TrademarkRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private TrademarkRepository trademarkRepository;

}


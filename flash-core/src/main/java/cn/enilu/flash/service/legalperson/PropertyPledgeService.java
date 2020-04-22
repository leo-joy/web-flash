package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.PropertyPledge;
import cn.enilu.flash.dao.legalperson.PropertyPledgeRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PropertyPledgeService extends BaseService<PropertyPledge,Long,PropertyPledgeRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private PropertyPledgeRepository propertyPledgeRepository;

}


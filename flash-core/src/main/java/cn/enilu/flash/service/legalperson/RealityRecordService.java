package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.RealityRecord;
import cn.enilu.flash.dao.legalperson.RealityRecordRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RealityRecordService extends BaseService<RealityRecord,Long,RealityRecordRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private RealityRecordRepository realityRecordRepository;

}


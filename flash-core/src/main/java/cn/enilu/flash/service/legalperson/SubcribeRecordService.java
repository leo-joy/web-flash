package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.SubcribeRecord;
import cn.enilu.flash.dao.legalperson.SubcribeRecordRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SubcribeRecordService extends BaseService<SubcribeRecord,Long,SubcribeRecordRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private SubcribeRecordRepository subcribeRecordRepository;

}


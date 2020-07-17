package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.ThreeMeeting;
import cn.enilu.flash.dao.legalperson.ThreeMeetingRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ThreeMeetingService extends BaseService<ThreeMeeting,Long,ThreeMeetingRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private ThreeMeetingRepository threeMeetingRepository;

}


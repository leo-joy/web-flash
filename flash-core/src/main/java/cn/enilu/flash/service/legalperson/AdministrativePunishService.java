package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.AdministrativePunish;
import cn.enilu.flash.dao.legalperson.AdministrativePunishRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdministrativePunishService extends BaseService<AdministrativePunish,Long,AdministrativePunishRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private AdministrativePunishRepository administrativePunishRepository;

}


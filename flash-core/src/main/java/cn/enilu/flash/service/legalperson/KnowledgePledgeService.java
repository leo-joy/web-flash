package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.KnowledgePledge;
import cn.enilu.flash.dao.legalperson.KnowledgePledgeRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KnowledgePledgeService extends BaseService<KnowledgePledge,Long,KnowledgePledgeRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private KnowledgePledgeRepository knowledgePledgeRepository;

}


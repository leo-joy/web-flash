package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.MainMember;
import cn.enilu.flash.dao.legalperson.MainMemberRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MainMemberService extends BaseService<MainMember,Long,MainMemberRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private MainMemberRepository mainMemberRepository;

}


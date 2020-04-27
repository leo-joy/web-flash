package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.Shareholder;
import cn.enilu.flash.dao.legalperson.ShareholderRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShareholderService extends BaseService<Shareholder,Long,ShareholderRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private ShareholderRepository shareholderRepository;

}

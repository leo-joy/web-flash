package cn.enilu.flash.api.controller.legalperson;

import cn.enilu.flash.bean.entity.legalperson.CompanyModify;
import cn.enilu.flash.service.legalperson.CompanyModifyService;

import cn.enilu.flash.bean.core.BussinessLog;
import cn.enilu.flash.bean.constant.factory.PageFactory;
import cn.enilu.flash.bean.dictmap.CommonDict;
import cn.enilu.flash.bean.enumeration.BizExceptionEnum;
import cn.enilu.flash.bean.exception.ApplicationException;
import cn.enilu.flash.bean.vo.front.Rets;

import cn.enilu.flash.utils.Maps;
import cn.enilu.flash.utils.ToolUtil;
import cn.enilu.flash.utils.factory.Page;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lpm/company/modify")
public class CompanyModifyController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private CompanyModifyService companyModifyService;

	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list() {
	Page<CompanyModify> page = new PageFactory<CompanyModify>().defaultPage();
		page = companyModifyService.queryPage(page);
		return Rets.success(page);
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑企业变更", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute CompanyModify tLpmCompanyModify){
		if(tLpmCompanyModify.getId()==null){
			companyModifyService.insert(tLpmCompanyModify);
		}else {
			companyModifyService.update(tLpmCompanyModify);
		}
		return Rets.success();
	}
	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除企业变更", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		companyModifyService.delete(id);
		return Rets.success();
	}
}
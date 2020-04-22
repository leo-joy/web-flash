package cn.enilu.flash.api.controller.legalperson;

import cn.enilu.flash.bean.entity.legalperson.AdministrativeLicense;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.legalperson.AdministrativeLicenseService;

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
@RequestMapping("/lpm/administrative/license")
public class AdministrativeLicenseController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private AdministrativeLicenseService administrativeLicenseService;

	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list(@RequestParam(required = false) String enterpriseCode) {
	Page<AdministrativeLicense> page = new PageFactory<AdministrativeLicense>().defaultPage();
		page.addFilter("enterpriseCode", SearchFilter.Operator.EQ,enterpriseCode);
		page = administrativeLicenseService.queryPage(page);
		return Rets.success(page);
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑行政许可信息", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute AdministrativeLicense tLpmAdministrativeLicense){
		if(tLpmAdministrativeLicense.getId()==null){
			administrativeLicenseService.insert(tLpmAdministrativeLicense);
		}else {
			administrativeLicenseService.update(tLpmAdministrativeLicense);
		}
		return Rets.success();
	}
	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除行政许可信息", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		administrativeLicenseService.delete(id);
		return Rets.success();
	}
}
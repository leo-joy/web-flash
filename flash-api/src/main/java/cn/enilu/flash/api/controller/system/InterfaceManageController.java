package cn.enilu.flash.api.controller.system;

import cn.enilu.flash.bean.entity.system.InterfaceManage;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.system.InterfaceManageService;

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
@RequestMapping("/sys/interface/manage")
public class InterfaceManageController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private InterfaceManageService interfaceManageService;

	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list(@RequestParam(required = false) String code) {
	Page<InterfaceManage> page = new PageFactory<InterfaceManage>().defaultPage();
		page.addFilter("code", SearchFilter.Operator.EQ,code);
		page = interfaceManageService.queryPage(page);
		return Rets.success(page);
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑接口管理", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute InterfaceManage tSysInterfaceManage){
		if(tSysInterfaceManage.getId()==null){
			interfaceManageService.insert(tSysInterfaceManage);
		}else {
			interfaceManageService.update(tSysInterfaceManage);
		}
		return Rets.success();
	}
	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除接口管理", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		interfaceManageService.delete(id);
		return Rets.success();
	}
}
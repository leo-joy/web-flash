package cn.enilu.flash.api.controller.system;

import cn.enilu.flash.bean.entity.system.CompanyPermission;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.system.CompanyPermissionService;

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
@RequestMapping("/sys/company/permission")
public class CompanyPermissionController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private CompanyPermissionService companyPermissionService;

	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list() {
	Page<CompanyPermission> page = new PageFactory<CompanyPermission>().defaultPage();
		page = companyPermissionService.queryPage(page);
		return Rets.success(page);
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑公司角色关系", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute CompanyPermission tSysCompanyPermission){
		if(tSysCompanyPermission.getId()==null){
			companyPermissionService.insert(tSysCompanyPermission);
		}else {
			companyPermissionService.update(tSysCompanyPermission);
		}
		return Rets.success();
	}
	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除公司角色关系", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		companyPermissionService.delete(id);
		return Rets.success();
	}

	@RequestMapping(value = "/listByRoleId",method = RequestMethod.GET)
	public Object listByRoleId(
			@RequestParam(required = false) Long roleId
	) {
		Page<CompanyPermission> page = new PageFactory<CompanyPermission>().defaultPage();
		page.addFilter("roleid", SearchFilter.Operator.EQ, roleId);
		page = companyPermissionService.queryPage(page);
		return Rets.success(page);
	}
}
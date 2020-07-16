package cn.enilu.flash.api.controller.legalperson;

import cn.enilu.flash.bean.entity.legalperson.CapitalModify;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.legalperson.CapitalModifyService;

import cn.enilu.flash.bean.core.BussinessLog;
import cn.enilu.flash.bean.constant.factory.PageFactory;
import cn.enilu.flash.bean.dictmap.CommonDict;
import cn.enilu.flash.bean.enumeration.BizExceptionEnum;
import cn.enilu.flash.bean.exception.ApplicationException;
import cn.enilu.flash.bean.vo.front.Rets;

import cn.enilu.flash.service.system.LogObjectHolder;
import cn.enilu.flash.utils.Maps;
import cn.enilu.flash.utils.ToolUtil;
import cn.enilu.flash.utils.factory.Page;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;

@RestController
@RequestMapping("/lpm/capital/modify")
public class CapitalModifyController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private CapitalModifyService capitalModifyService;

	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list(@RequestParam(required = false) String modifyStatusType,
					   @RequestParam(required = false) String branchCompanyCode,
					   @RequestParam(required = false) String serialIdModify,
					   @RequestParam(required = false) String createBy,
					   @RequestParam(required = false) String ids) {
	Page<CapitalModify> page = new PageFactory<CapitalModify>().defaultPage();
		page.addFilter("modifyStatusType", SearchFilter.Operator.EQ,modifyStatusType);
		page.addFilter("branchCompanyCode", SearchFilter.Operator.EQ,branchCompanyCode);
		if(serialIdModify != null && !serialIdModify.isEmpty()) {
			ArrayList lists = new ArrayList(Arrays.asList(serialIdModify.split(",")));
			page.addFilter("serialIdModify", SearchFilter.Operator.IN,lists);
		}
		if(createBy != null && !createBy.isEmpty()) {
			page.addFilter("modifyBy", SearchFilter.Operator.EQ,createBy);
		}
		if(ids != null && !ids.isEmpty()) {
			ArrayList lists = new ArrayList(Arrays.asList(ids.split(",")));
			page.addFilter("id", SearchFilter.Operator.IN,lists);
		}
		page = capitalModifyService.queryPage(page);
		return Rets.success(page);
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑股东及出资信息变更", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute CapitalModify tLpmCapitalModify){
		CapitalModify response;
		if(tLpmCapitalModify.getId()==null){
			response = capitalModifyService.insert(tLpmCapitalModify);
		}else {
			CapitalModify old = capitalModifyService.get(tLpmCapitalModify.getId());
			LogObjectHolder.me().set(old);
			response = capitalModifyService.update(tLpmCapitalModify);
		}
		return Rets.success(response);
	}
	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除股东及出资信息变更", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		capitalModifyService.delete(id);
		return Rets.success();
	}
}
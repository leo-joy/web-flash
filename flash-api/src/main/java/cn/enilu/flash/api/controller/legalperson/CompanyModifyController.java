package cn.enilu.flash.api.controller.legalperson;

import cn.enilu.flash.bean.entity.legalperson.CompanyModify;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.legalperson.CompanyModifyService;

import cn.enilu.flash.bean.core.BussinessLog;
import cn.enilu.flash.bean.constant.factory.PageFactory;
import cn.enilu.flash.bean.dictmap.CommonDict;
import cn.enilu.flash.bean.enumeration.BizExceptionEnum;
import cn.enilu.flash.bean.exception.ApplicationException;
import cn.enilu.flash.bean.vo.front.Rets;

import cn.enilu.flash.service.system.LogObjectHolder;
import cn.enilu.flash.utils.Maps;
import cn.enilu.flash.utils.StringUtil;
import cn.enilu.flash.utils.ToolUtil;
import cn.enilu.flash.utils.factory.Page;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/lpm/company/modify")
public class CompanyModifyController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private CompanyModifyService companyModifyService;

	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list(@RequestParam(required = false) String enterpriseId) {
		SearchFilter filter = null;
		if(StringUtil.isNotEmpty(enterpriseId)){
			filter =  SearchFilter.build("enterpriseId", SearchFilter.Operator.EQ,enterpriseId);
		}
		//Sort sort = new Sort(new Sort.Order(Sort.Direction.DESC,"modifyDate"));
		//List<CompanyModify> list = companyModifyService.queryAll(filter, sort);
		List<Sort.Order> orders = new ArrayList<>();
		orders.add(new Sort.Order(Sort.Direction.DESC,"modifyDate"));
		List<CompanyModify> list = companyModifyService.queryAll(filter, new Sort(orders));
		return Rets.success(list);		
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑企业变更", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute CompanyModify tLpmCompanyModify){
		CompanyModify response;
		if(tLpmCompanyModify.getId()==null){
			response = companyModifyService.insert(tLpmCompanyModify);
		}else {
			CompanyModify old = companyModifyService.get(tLpmCompanyModify.getId());
			LogObjectHolder.me().set(old);
			response = companyModifyService.update(tLpmCompanyModify);
		}
		return Rets.success(response);
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
package cn.enilu.flash.api.controller.legalperson;

import cn.enilu.flash.bean.entity.legalperson.InvestCompany;
import cn.enilu.flash.bean.vo.node.InvestCompanyNode;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.legalperson.InvestCompanyService;

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

import java.util.List;


@RestController
@RequestMapping("/lpm/invest/company")
public class InvestCompanyController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private InvestCompanyService investCompanyService;

	@RequestMapping(value = "/tree",method = RequestMethod.GET)
	public Object tree(@RequestParam(required = false) String enterpriseCode) {
		List<InvestCompanyNode> list = investCompanyService.queryAllNode(enterpriseCode);
		return Rets.success(list);
	}
	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list(@RequestParam(required = false) String enterpriseCode) {
	Page<InvestCompany> page = new PageFactory<InvestCompany>().defaultPage();
		page.addFilter("enterpriseCode", SearchFilter.Operator.EQ,enterpriseCode);
		page = investCompanyService.queryPage(page);
		return Rets.success(page);
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑投资企业", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute InvestCompany tLpmInvestCompany){
		if(tLpmInvestCompany.getId()==null){
			investCompanyService.insert(tLpmInvestCompany);
		}else {
			investCompanyService.update(tLpmInvestCompany);
		}
		return Rets.success();
	}
	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除投资企业", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		investCompanyService.delete(id);
		return Rets.success();
	}
}
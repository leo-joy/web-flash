package cn.enilu.flash.api.controller.legalperson;

import cn.enilu.flash.bean.entity.legalperson.Capital;
import cn.enilu.flash.bean.vo.node.CapitalNode;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.legalperson.CapitalService;

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
@RequestMapping("/lpm/capital")
public class CapitalController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private CapitalService capitalService;

	@RequestMapping(value = "/tree",method = RequestMethod.GET)
	public Object tree(@RequestParam(required = false) String enterpriseCode) {
		List<CapitalNode> list = capitalService.queryAllNode(enterpriseCode);
		return Rets.success(list);
	}
	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list(@RequestParam(required = false) Long id,
						@RequestParam(required = false) String enterpriseCode,
					   @RequestParam(required = false) String branchCompanyCode) {
	Page<Capital> page = new PageFactory<Capital>().defaultPage();
		page.addFilter("id", SearchFilter.Operator.EQ,id);
		page.addFilter("enterpriseCode", SearchFilter.Operator.EQ,enterpriseCode);
		page.addFilter("branchCompanyCode", SearchFilter.Operator.EQ,branchCompanyCode);
		page = capitalService.queryPage(page);
		return Rets.success(page);
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑股东及出资信息", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute Capital tLpmCapital){
		if(tLpmCapital.getId()==null){
			capitalService.insert(tLpmCapital);
		}else {
			capitalService.update(tLpmCapital);
		}
		return Rets.success();
	}
	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除股东及出资信息", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		capitalService.delete(id);
		return Rets.success();
	}
}
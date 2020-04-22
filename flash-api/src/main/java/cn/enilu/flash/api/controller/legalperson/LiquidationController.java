package cn.enilu.flash.api.controller.legalperson;

import cn.enilu.flash.bean.entity.legalperson.Liquidation;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.legalperson.LiquidationService;

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
@RequestMapping("/lpm/liquidation")
public class LiquidationController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private LiquidationService liquidationService;

	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list(@RequestParam(required = false) String enterpriseCode) {
	Page<Liquidation> page = new PageFactory<Liquidation>().defaultPage();
		page.addFilter("enterpriseCode", SearchFilter.Operator.EQ,enterpriseCode);
		page = liquidationService.queryPage(page);
		return Rets.success(page);
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑清算信息", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute Liquidation tLpmLiquidation){
		if(tLpmLiquidation.getId()==null){
			liquidationService.insert(tLpmLiquidation);
		}else {
			liquidationService.update(tLpmLiquidation);
		}
		return Rets.success();
	}
	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除清算信息", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		liquidationService.delete(id);
		return Rets.success();
	}
}
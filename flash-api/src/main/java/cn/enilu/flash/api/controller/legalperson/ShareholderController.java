package cn.enilu.flash.api.controller.legalperson;

import cn.enilu.flash.bean.entity.legalperson.Shareholder;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.legalperson.ShareholderService;

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
@RequestMapping("/lpm/shareholder")
public class ShareholderController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private ShareholderService shareholderService;

	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list(@RequestParam(required = false) String enterpriseCode) {
	Page<Shareholder> page = new PageFactory<Shareholder>().defaultPage();
		page.addFilter("enterpriseCode", SearchFilter.Operator.EQ,enterpriseCode);
		page = shareholderService.queryPage(page);
		return Rets.success(page);
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑股东信息", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute Shareholder tLpmShareholder){
		if(tLpmShareholder.getId()==null){
			shareholderService.insert(tLpmShareholder);
		}else {
			shareholderService.update(tLpmShareholder);
		}
		return Rets.success();
	}
	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除股东信息", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		shareholderService.delete(id);
		return Rets.success();
	}
}
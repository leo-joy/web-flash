package cn.enilu.flash.api.controller.legalperson;

import cn.enilu.flash.bean.entity.legalperson.SubcribeRecord;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.legalperson.SubcribeRecordService;

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
@RequestMapping("/lpm/subcribe/record")
public class SubcribeRecordController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private SubcribeRecordService subcribeRecordService;

	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list(@RequestParam(required = false) String enterpriseCode,
					   @RequestParam(required = false) String serialNumber) {
	Page<SubcribeRecord> page = new PageFactory<SubcribeRecord>().defaultPage();
		page.addFilter("enterpriseCode", SearchFilter.Operator.EQ,enterpriseCode);
		page.addFilter("serialNumber", SearchFilter.Operator.EQ,serialNumber);
		page = subcribeRecordService.queryPage(page);
		return Rets.success(page);
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑股东认缴记录信息", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute SubcribeRecord tLpmSubcribeRecord){
		if(tLpmSubcribeRecord.getId()==null){
			subcribeRecordService.insert(tLpmSubcribeRecord);
		}else {
			subcribeRecordService.update(tLpmSubcribeRecord);
		}
		return Rets.success();
	}
	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除股东认缴记录信息", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		subcribeRecordService.delete(id);
		return Rets.success();
	}
}
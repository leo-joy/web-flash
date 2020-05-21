package cn.enilu.flash.api.controller.legalperson;

import cn.enilu.flash.bean.entity.legalperson.RealityRecord;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.legalperson.RealityRecordService;

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
@RequestMapping("/lpm/reality/record")
public class RealityRecordController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private RealityRecordService realityRecordService;

	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list(@RequestParam(required = false) String enterpriseCode,
					   @RequestParam(required = false) String serialNumber) {
	Page<RealityRecord> page = new PageFactory<RealityRecord>().defaultPage();
		page.addFilter("enterpriseCode", SearchFilter.Operator.EQ,enterpriseCode);
		page.addFilter("serialNumber", SearchFilter.Operator.EQ,serialNumber);
		page = realityRecordService.queryPage(page);
		return Rets.success(page);
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑股东实缴记录信息", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute RealityRecord tLpmRealityRecord){
		if(tLpmRealityRecord.getId()==null){
			realityRecordService.insert(tLpmRealityRecord);
		}else {
			realityRecordService.update(tLpmRealityRecord);
		}
		return Rets.success();
	}
	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除股东实缴记录信息", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		realityRecordService.delete(id);
		return Rets.success();
	}
}
package cn.enilu.flash.api.controller.legalperson;

import cn.enilu.flash.bean.entity.legalperson.ModifyLog;
import cn.enilu.flash.service.legalperson.ModifyLogService;

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
@RequestMapping("/lpm/modify/log")
public class ModifyLogController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private ModifyLogService modifyLogService;

	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list() {
	Page<ModifyLog> page = new PageFactory<ModifyLog>().defaultPage();
		page = modifyLogService.queryPage(page);
		return Rets.success(page);
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑业务修改信息", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute ModifyLog tLpmModifyLog){
		if(tLpmModifyLog.getId()==null){
			modifyLogService.insert(tLpmModifyLog);
		}else {
			modifyLogService.update(tLpmModifyLog);
		}
		return Rets.success();
	}
	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除业务修改信息", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		modifyLogService.delete(id);
		return Rets.success();
	}
}
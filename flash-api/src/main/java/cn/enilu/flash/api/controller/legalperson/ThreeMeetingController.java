package cn.enilu.flash.api.controller.legalperson;

import cn.enilu.flash.bean.entity.legalperson.ThreeMeeting;
import cn.enilu.flash.service.legalperson.ThreeMeetingService;

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
@RequestMapping("/lpm/three/meeting")
public class ThreeMeetingController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private ThreeMeetingService threeMeetingService;

	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list() {
	Page<ThreeMeeting> page = new PageFactory<ThreeMeeting>().defaultPage();
		page = threeMeetingService.queryPage(page);
		return Rets.success(page);
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑三会管理", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute ThreeMeeting tLpmThreeMeeting){
		if(tLpmThreeMeeting.getId()==null){
			threeMeetingService.insert(tLpmThreeMeeting);
		}else {
			threeMeetingService.update(tLpmThreeMeeting);
		}
		return Rets.success();
	}
	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除三会管理", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		threeMeetingService.delete(id);
		return Rets.success();
	}
}
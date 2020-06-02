package cn.enilu.flash.api.controller.legalperson;

import cn.enilu.flash.bean.entity.legalperson.MainMember;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.legalperson.MainMemberService;

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
@RequestMapping("/lpm/main/member")
public class MainMemberController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private MainMemberService mainMemberService;

	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list(@RequestParam(required = false) String enterpriseCode,
					   @RequestParam(required = false) String chairman,
					   @RequestParam(required = false) String director,
					   @RequestParam(required = false) String supervisor,
					   @RequestParam(required = false) String generalManager) {
	Page<MainMember> page = new PageFactory<MainMember>().defaultPage();
		page.addFilter("enterpriseCode", SearchFilter.Operator.EQ,enterpriseCode);
		page.addFilter("chairman", SearchFilter.Operator.LIKE,chairman);
		page.addFilter("director", SearchFilter.Operator.LIKE,director);
		page.addFilter("supervisor", SearchFilter.Operator.LIKE,supervisor);
		page.addFilter("generalManager", SearchFilter.Operator.LIKE,generalManager);
		page = mainMemberService.queryPage(page);
		return Rets.success(page);
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑主要人员信息", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute MainMember tLpmMainMember){
		if(tLpmMainMember.getId()==null){
			mainMemberService.insert(tLpmMainMember);
		}else {
			mainMemberService.update(tLpmMainMember);
		}
		return Rets.success();
	}
	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除主要人员信息", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		mainMemberService.delete(id);
		return Rets.success();
	}
}
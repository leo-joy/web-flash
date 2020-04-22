package cn.enilu.flash.api.controller.legalperson;

import cn.enilu.flash.bean.entity.legalperson.CertificateCancel;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.legalperson.CertificateCancelService;

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
@RequestMapping("/lpm/certificate/cancel")
public class CertificateCancelController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private CertificateCancelService certificateCancelService;

	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list(@RequestParam(required = false) String enterpriseCode) {
	Page<CertificateCancel> page = new PageFactory<CertificateCancel>().defaultPage();
		page.addFilter("enterpriseCode", SearchFilter.Operator.EQ,enterpriseCode);
		page = certificateCancelService.queryPage(page);
		return Rets.success(page);
	}
	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑证照作废声明", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute CertificateCancel tLpmCertificateCancel){
		if(tLpmCertificateCancel.getId()==null){
			certificateCancelService.insert(tLpmCertificateCancel);
		}else {
			certificateCancelService.update(tLpmCertificateCancel);
		}
		return Rets.success();
	}
	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除证照作废声明", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		certificateCancelService.delete(id);
		return Rets.success();
	}
}
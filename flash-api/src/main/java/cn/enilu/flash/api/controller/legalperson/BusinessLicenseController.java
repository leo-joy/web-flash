package cn.enilu.flash.api.controller.legalperson;

import cn.enilu.flash.bean.entity.legalperson.BusinessLicense;
import cn.enilu.flash.bean.entity.legalperson.CompanyModify;
import cn.enilu.flash.bean.enumeration.Permission;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.system.FileService;
import cn.enilu.flash.service.legalperson.BusinessLicenseService;

import cn.enilu.flash.bean.core.BussinessLog;
import cn.enilu.flash.bean.constant.factory.PageFactory;
import cn.enilu.flash.bean.dictmap.CommonDict;
import cn.enilu.flash.bean.enumeration.BizExceptionEnum;
import cn.enilu.flash.bean.exception.ApplicationException;
import cn.enilu.flash.bean.vo.front.Rets;

import cn.enilu.flash.service.system.LogObjectHolder;
import cn.enilu.flash.utils.Maps;
import cn.enilu.flash.utils.StringUtil;
import cn.enilu.flash.utils.ToolUtil;
import cn.enilu.flash.utils.factory.Page;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.Param;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/lpm/businesslicense")
public class BusinessLicenseController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private FileService fileService;
	@Autowired
	private BusinessLicenseService businessLicenseService;

	@RequestMapping(method = RequestMethod.GET)
	public Object get(@Param("id") Long id) {
		BusinessLicense businessLicense = businessLicenseService.get(id);
		return Rets.success(businessLicense);
	}


	@RequestMapping(method = RequestMethod.POST)
	@BussinessLog(value = "编辑营业执照", key = "name",dict= CommonDict.class)
	public Object save(@ModelAttribute BusinessLicense tLpmBusinessLicense){
//		if(tLpmBusinessLicense.getId()==null){
//			businessLicenseService.insert(tLpmBusinessLicense);
//		}else {
//			businessLicenseService.update(tLpmBusinessLicense);
//		}
		if (ToolUtil.isOneEmpty(tLpmBusinessLicense, tLpmBusinessLicense.getEnterpriseName())) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		BusinessLicense response;
		if(tLpmBusinessLicense.getId()!=null){
			BusinessLicense old = businessLicenseService.get(tLpmBusinessLicense.getId());
			LogObjectHolder.me().set(old);
			response = businessLicenseService.update(tLpmBusinessLicense);
		}else {
			response = businessLicenseService.insert(tLpmBusinessLicense);
		}
		Long mainModuleId = Long.valueOf(response.getId()).longValue();
		String mainModuleName = response.getEnterpriseName();
		String fileStatus = "1";

		String businessLicenseFilesFiles = response.getBusinessLicenseFiles();	// 营业执照附件
		Long businessLicenseFilesModuleId = Long.valueOf(1000001).longValue();
		String businessLicenseFilesModuleName = "营业执照";
		fileService.update(businessLicenseFilesFiles, mainModuleId, mainModuleName, businessLicenseFilesModuleId, businessLicenseFilesModuleName, fileStatus);

		String approvalFilesFiles = response.getApprovalFiles();	// 核准文件附件
		Long approvalFilesModuleId = Long.valueOf(1000002).longValue();
		String approvalFilesModuleName = "核准文件";
		fileService.update(approvalFilesFiles, mainModuleId, mainModuleName, approvalFilesModuleId, approvalFilesModuleName, fileStatus);

		String companyArticlesAssociationFiles = response.getCompanyArticlesAssociation();	// 公司章程附件
		Long companyArticlesAssociationModuleId = Long.valueOf(1000003).longValue();
		String companyArticlesAssociationModuleName = "公司章程";
		fileService.update(companyArticlesAssociationFiles, mainModuleId, mainModuleName, companyArticlesAssociationModuleId, companyArticlesAssociationModuleName, fileStatus);

		String shareholdersDecideFiles = response.getShareholdersDecide();	// 股东决定附件
		Long shareholdersDecideModuleId = Long.valueOf(1000004).longValue();
		String shareholdersDecideModuleName = "股东决定";
		fileService.update(shareholdersDecideFiles, mainModuleId, mainModuleName, shareholdersDecideModuleId, shareholdersDecideModuleName, fileStatus);

		String applicationRegistrationFiles = response.getApplicationRegistrationFiles();	// 申请注册文件附件
		Long applicationRegistrationModuleId = Long.valueOf(1000005).longValue();
		String applicationRegistrationModuleName = "申请注册文件";
		fileService.update(applicationRegistrationFiles, mainModuleId, mainModuleName, applicationRegistrationModuleId, applicationRegistrationModuleName, fileStatus);

		String otherFiles = response.getOtherFiles();	// 其他文件附件
		Long otherFilesModuleId = Long.valueOf(1000005).longValue();
		String otherFilesModuleName = "其他文件";
		fileService.update(otherFiles, mainModuleId, mainModuleName, otherFilesModuleId, otherFilesModuleName, fileStatus);
		return Rets.success(response);
	}


	@RequestMapping(method = RequestMethod.DELETE)
	@BussinessLog(value = "删除营业执照", key = "id",dict= CommonDict.class)
	public Object remove(Long id){
		if (id == null) {
			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
		}
		BusinessLicense response = businessLicenseService.get(id);
		String fileStatus = "0";

		String businessLicenseFilesFiles = response.getBusinessLicenseFiles();	// 营业执照附件
		fileService.updateFileStatus(businessLicenseFilesFiles , fileStatus);

		String approvalFilesFiles = response.getApprovalFiles();	// 核准文件附件
		fileService.updateFileStatus(approvalFilesFiles , fileStatus);

		String companyArticlesAssociationFiles = response.getCompanyArticlesAssociation();	// 公司章程附件
		fileService.updateFileStatus(companyArticlesAssociationFiles , fileStatus);

		String shareholdersDecideFiles = response.getShareholdersDecide();	// 股东决定附件
		fileService.updateFileStatus(shareholdersDecideFiles , fileStatus);

		String applicationRegistrationFiles = response.getApplicationRegistrationFiles();	// 申请注册文件附件
		fileService.updateFileStatus(applicationRegistrationFiles , fileStatus);

		String otherFiles = response.getOtherFiles();	// 其他文件附件
		fileService.updateFileStatus(otherFiles , fileStatus);
		businessLicenseService.delete(id);
		return Rets.success();
	}

	@RequestMapping(value = "/list",method = RequestMethod.GET)
	public Object list(@RequestParam(required = false) String enterpriseName,
					   @RequestParam(required = false) String enterpriseNameEn,
					   @RequestParam(required = false) String enterpriseNameBusiness,
					   @RequestParam(required = false) String unifiedSocialCreditCode,
					   @RequestParam(required = false) String legalRepresentative,
					   @RequestParam(required = false) String pIds,
					   @RequestParam(required = false) String tag,
					   @RequestParam(required = false) String registrationType,
					   @RequestParam(required = false) String registrationStatus,
					   @RequestParam(required = false) String ids,
					   @RequestParam(required = false) Long id) {
		Page<BusinessLicense> page = new PageFactory<BusinessLicense>().defaultPage();
		page.addFilter("enterpriseName", SearchFilter.Operator.LIKE,enterpriseName);
		page.addFilter("enterpriseNameEn", SearchFilter.Operator.LIKE,enterpriseNameEn);
		page.addFilter("enterpriseNameBusiness", SearchFilter.Operator.LIKE,enterpriseNameBusiness);
		page.addFilter("unifiedSocialCreditCode", SearchFilter.Operator.LIKE,unifiedSocialCreditCode);
		page.addFilter("legalRepresentative", SearchFilter.Operator.LIKE,legalRepresentative);
		page.addFilter("pIds", SearchFilter.Operator.LIKE,pIds);
		page.addFilter("tags", SearchFilter.Operator.LIKE,tag);
		page.addFilter("id", SearchFilter.Operator.EQ,id);
		if(ids != null && !ids.isEmpty()) {
			ArrayList lists = new ArrayList(Arrays.asList(ids.split(",")));
			page.addFilter("id", SearchFilter.Operator.IN,lists);
		}
		if(registrationType != null && !registrationType.isEmpty()) {
			ArrayList lists = new ArrayList(Arrays.asList(registrationType.split(",")));
			page.addFilter("registrationType", SearchFilter.Operator.IN,lists);
		}
		//page.addFilter("registrationType", SearchFilter.Operator.EQ,registrationType);
		page.addFilter("registrationStatus", SearchFilter.Operator.EQ,registrationStatus);
		// 添加排序规则
		Sort sort = new Sort(new Sort.Order(Sort.Direction.DESC,"customType"));
		page.setSort(sort);
		
		page = businessLicenseService.queryPage(page);
		return Rets.success(page);
	}

	@RequestMapping(value = "/haslist",method = RequestMethod.POST)
	public Object haslist(@RequestParam(required = false) String enterpriseName,
					   @RequestParam(required = false) String enterpriseNameEn,
					   @RequestParam(required = false) String enterpriseNameBusiness,
					   @RequestParam(required = false) String unifiedSocialCreditCode,
					   @RequestParam(required = false) String legalRepresentative,
					   @RequestParam(required = false) String pIds,
					   @RequestParam(required = false) String tag,
					   @RequestParam(required = false) String registrationType,
					   @RequestParam(required = false) String registrationStatus,
					   @RequestParam(required = false) String ids,
					   @RequestParam(required = false) Long id) {
		Page<BusinessLicense> page = new PageFactory<BusinessLicense>().defaultPage();
		page.addFilter("enterpriseName", SearchFilter.Operator.LIKE,enterpriseName);
		page.addFilter("enterpriseNameEn", SearchFilter.Operator.LIKE,enterpriseNameEn);
		page.addFilter("enterpriseNameBusiness", SearchFilter.Operator.LIKE,enterpriseNameBusiness);
		page.addFilter("unifiedSocialCreditCode", SearchFilter.Operator.LIKE,unifiedSocialCreditCode);
		page.addFilter("legalRepresentative", SearchFilter.Operator.LIKE,legalRepresentative);
		page.addFilter("pIds", SearchFilter.Operator.LIKE,pIds);
		page.addFilter("tags", SearchFilter.Operator.LIKE,tag);
		page.addFilter("id", SearchFilter.Operator.EQ,id);
		if(ids != null && !ids.isEmpty()) {
			ArrayList lists = new ArrayList(Arrays.asList(ids.split(",")));
			page.addFilter("id", SearchFilter.Operator.IN,lists);
		}
		if(registrationType != null && !registrationType.isEmpty()) {
			ArrayList lists = new ArrayList(Arrays.asList(registrationType.split(",")));
			page.addFilter("registrationType", SearchFilter.Operator.IN,lists);
		}
		//page.addFilter("registrationType", SearchFilter.Operator.EQ,registrationType);
		page.addFilter("registrationStatus", SearchFilter.Operator.EQ,registrationStatus);
		// 添加排序规则
		Sort sort = new Sort(new Sort.Order(Sort.Direction.DESC,"customType"));
		page.setSort(sort);

		page = businessLicenseService.queryPage(page);
		return Rets.success(page);
	}

	@RequestMapping(value = "/one",method = RequestMethod.GET)
	public Object list(@RequestParam(required = false) String enterpriseName) {
		Page<BusinessLicense> page = new PageFactory<BusinessLicense>().defaultPage();
		page.addFilter("enterpriseName", SearchFilter.Operator.EQ,enterpriseName);
		page = businessLicenseService.queryPage(page);
		return Rets.success(page);
	}
}
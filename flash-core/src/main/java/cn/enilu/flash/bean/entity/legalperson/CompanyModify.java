package cn.enilu.flash.bean.entity.legalperson;

import cn.enilu.flash.bean.entity.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Table;
import org.hibernate.annotations.Type;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Entity(name="t_lpm_company_modify")
@Data
@Table(appliesTo = "t_lpm_company_modify",comment = "企业变更")
@EntityListeners(AuditingEntityListener.class)
public class CompanyModify extends BaseEntity {
    @Column
    private String pid;

    @Column
    private String pName;

    @Column
    private String pIds;

    @Column(name="affiliated_unit", columnDefinition = "VARCHAR(128) COMMENT '所属单位'")
    private String affiliatedUnit;

    @Column(name="apply_department", columnDefinition = "VARCHAR(128) COMMENT '申请部门'")
    private String applyDepartment;

    @Column(name="applicant", columnDefinition = "VARCHAR(128) COMMENT '申请人'")
    private String applicant;

    @Column(name="apply_time", columnDefinition = "VARCHAR(128) COMMENT '申请时间'")
    private String applyTime;

    @Column(name="applicant_contact", columnDefinition = "VARCHAR(64) COMMENT '办理人联系方式'")
    private String applicantContact;

    @Column(name="apply_type", columnDefinition = "VARCHAR(32) COMMENT '申请类型'")
    private String applyType;

    @Column(name="apply_reason", columnDefinition = "VARCHAR(256) COMMENT '申请理由'")
    private String applyReason;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="modify_date", columnDefinition = "DATE COMMENT '变更日期'")
    private Date modifyDate;

    @Column(name="syn_state", columnDefinition = "VARCHAR(32) COMMENT '同步状态'")
    private String synState;



    @Column(name="enterprise_id", columnDefinition = "VARCHAR(128) COMMENT '企业id'")
    private String enterpriseId;

    @Column(name="enterprise_name_state", columnDefinition = "VARCHAR(16) COMMENT '企业名称变更状态'")
    private String enterpriseNameState;

    @Column(name="enterprise_name_old", columnDefinition = "VARCHAR(128) COMMENT '旧企业名称'")
    private String enterpriseNameOld;

    @Column(name="enterprise_name_new", columnDefinition = "VARCHAR(128) COMMENT '新企业名称'")
    private String enterpriseNameNew;


    @Column(name="registered_address_state", columnDefinition = "VARCHAR(16) COMMENT '注册地址变更状态'")
    private String registeredAddressState;

    @Column(name="registered_address_old", columnDefinition = "VARCHAR(128) COMMENT '旧注册地址'")
    private String registeredAddressOld;

    @Column(name="registered_address_new", columnDefinition = "VARCHAR(128) COMMENT '新注册地址'")
    private String registeredAddressNew;


    @Column(name="business_scope_state", columnDefinition = "VARCHAR(16) COMMENT '经营范围变更状态'")
    private String businessScopeState;

    @Column(name="business_scope_old", columnDefinition = "TEXT COMMENT '旧经营范围'")
    private String businessScopeOld;

    @Column(name="business_scope_new", columnDefinition = "TEXT COMMENT '新经营范围'")
    private String businessScopeNew;

    @Column(name="operating_period_end_state", columnDefinition = "VARCHAR(16) COMMENT '营业期限变更状态'")
    private String operatingPeriodEndState;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="operating_period_end_old", columnDefinition = "DATE COMMENT '原营业期限至'")
    private Date operatingPeriodEndOld;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="operating_period_end_new", columnDefinition = "DATE COMMENT '新营业期限至'")
    private Date operatingPeriodEndNew;

    @Column(name="legal_representative_state", columnDefinition = "VARCHAR(32) COMMENT '法人变更状态'")
    private String legalRepresentativeState;

    @Column(name="legal_representative_old", columnDefinition = "VARCHAR(128) COMMENT '旧法人'")
    private String legalRepresentativeOld;

    @Column(name="legal_representative_new", columnDefinition = "VARCHAR(128) COMMENT '新法人'")
    private String legalRepresentativeNew;

    @Column(name="legal_representative_id_old", columnDefinition = "VARCHAR(16) COMMENT '旧法人id'")
    private String legalRepresentativeIdOld;

    @Column(name="legal_representative_id_new", columnDefinition = "VARCHAR(16) COMMENT '新法人id'")
    private String legalRepresentativeIdNew;

    @Column(name="chairman_state", columnDefinition = "VARCHAR(8) COMMENT '董事长变更状态'")
    private String chairmanState;

    @Column(name="chairman_old", columnDefinition = "VARCHAR(32) COMMENT '旧董事长'")
    private String chairmanOld;

    @Column(name="chairman_new", columnDefinition = "VARCHAR(32) COMMENT '新董事长'")
    private String chairmanNew;

    @Column(name="chairman_id_old", columnDefinition = "VARCHAR(16) COMMENT '旧董事长id'")
    private String chairmanIdOld;

    @Column(name="chairman_id_new", columnDefinition = "VARCHAR(16) COMMENT '新董事长id'")
    private String chairmanIdNew;

    @Column(name="director_state", columnDefinition = "VARCHAR(8) COMMENT '董事变更状态'")
    private String directorState;

    @Column(name="director_old", columnDefinition = "VARCHAR(128) COMMENT '旧董事'")
    private String directorOld;

    @Column(name="director_new", columnDefinition = "VARCHAR(128) COMMENT '新董事'")
    private String directorNew;

    @Column(name="director_id_old", columnDefinition = "VARCHAR(64) COMMENT '旧董事id'")
    private String directorIdOld;

    @Column(name="director_id_new", columnDefinition = "VARCHAR(64) COMMENT '新董事id'")
    private String directorIdNew;

    @Column(name="supervisor_state", columnDefinition = "VARCHAR(8) COMMENT '监事变更状态'")
    private String supervisorState;

    @Column(name="supervisor_old", columnDefinition = "VARCHAR(128) COMMENT '旧监事'")
    private String supervisorOld;

    @Column(name="supervisor_new", columnDefinition = "VARCHAR(128) COMMENT '新监事'")
    private String supervisorNew;

    @Column(name="supervisor_id_old", columnDefinition = "VARCHAR(64) COMMENT '旧监事id'")
    private String supervisorIdOld;

    @Column(name="supervisor_id_new", columnDefinition = "VARCHAR(64) COMMENT '新监事id'")
    private String supervisorIdNew;

    @Column(name="general_manager_state", columnDefinition = "VARCHAR(8) COMMENT '总经理变更状态'")
    private String generalManagerState;

    @Column(name="general_manager_old", columnDefinition = "VARCHAR(32) COMMENT '旧总经理'")
    private String generalManagerOld;

    @Column(name="general_manager_new", columnDefinition = "VARCHAR(32) COMMENT '新总经理'")
    private String generalManagerNew;

    @Column(name="general_manager_id_old", columnDefinition = "VARCHAR(16) COMMENT '旧总经理id'")
    private String generalManagerIdOld;

    @Column(name="general_manager_id_new", columnDefinition = "VARCHAR(16) COMMENT '新总经理id'")
    private String generalManagerIdNew;


    @Column(name="shareholder_modify_state", columnDefinition = "VARCHAR(8) COMMENT '股东变更状态'")
    private String shareholderModifyState;

    @Column(name="shareholder_ids_old", columnDefinition = "VARCHAR(32) COMMENT '旧股东ids'")
    private String shareholderIdsOld;

    @Column(name="shareholder_ids_new", columnDefinition = "VARCHAR(32) COMMENT '新股东ids'")
    private String shareholderIdsNew;


    @Column(name="business_license_files", columnDefinition = "VARCHAR(64) COMMENT '营业执照'")
    private String businessLicenseFiles;

    @Column(name="approval_files", columnDefinition = "VARCHAR(64) COMMENT '核准文件'")
    private String approvalFiles;

    @Column(name="company_reference_register_files", columnDefinition = "VARCHAR(64) COMMENT '公司备案登记表'")
    private String companyReferenceRegisterFiles;

    @Column(name="company_modify_register_files", columnDefinition = "VARCHAR(64) COMMENT '变更事项登记表'")
    private String companyModifyRegisterFiles;

    @Column(name="company_articles_association_files",columnDefinition = "VARCHAR(64) COMMENT '公司章程'")
    private String companyArticlesAssociationFiles;

    @Column(name="shareholders_decide_files", columnDefinition = "VARCHAR(64) COMMENT '股东会决议'")
    private String shareholdersDecideFiles;

    @Column(name="senior_management_files", columnDefinition = "VARCHAR(64) COMMENT '董事会决议'")
    private String seniorManagementFiles;

    @Column(name="promise_files", columnDefinition = "VARCHAR(64) COMMENT '承诺书'")
    private String promiseFiles;

    @Column(name="delegation_files", columnDefinition = "VARCHAR(64) COMMENT '委托书'")
    private String delegationFiles;

    @Column(name="authorization_files", columnDefinition = "VARCHAR(64) COMMENT '指定代表或者共同委托代理人授权委托书'")
    private String authorizationFiles;

    @Column(name="appoint_dismiss_files", columnDefinition = "VARCHAR(64) COMMENT '任职免职书'")
    private String appointDismissFiles;

    @Column(name="other_files", columnDefinition = "VARCHAR(64) COMMENT '其它文件'")
    private String otherFiles;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

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

@Entity(name="t_lpm_business_license")
@Data
@Table(appliesTo = "t_lpm_business_license",comment = "营业执照")
@EntityListeners(AuditingEntityListener.class)
public class BusinessLicense extends BaseEntity {
    @Column
    private String pid;

    @Column
    private String pName;

    @Column
    private String pIds;

    @Column(name="unified_social_credit_code", columnDefinition = "VARCHAR(64) COMMENT '统一社会信用代码'")
    private String unifiedSocialCreditCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(128) COMMENT '企业名称'")
    @NotBlank(message = "企业名称不能为空")
    private String enterpriseName;

    @Column(name="enterprise_name_en", columnDefinition = "VARCHAR(128) COMMENT '企业英文名称'")
    private String enterpriseNameEn;

    @Column(name="enterprise_name_business", columnDefinition = "VARCHAR(128) COMMENT '企业商用名称'")
    private String enterpriseNameBusiness;


    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '企业编号'")
    private String enterpriseCode;

    @Column(name="registration_place", columnDefinition = "VARCHAR(32) COMMENT '企业注册地code'")
    private String registrationPlace;

    @Column(name="registration_place_name", columnDefinition = "VARCHAR(32) COMMENT '企业注册地名称'")
    private String registrationPlaceName;

    @Column(name="type", columnDefinition = "VARCHAR(32) COMMENT '企业类型'")
    private String type;

    @Column(name="custom_type", columnDefinition = "VARCHAR(32) COMMENT '自定义企业类型'")
    private String customType;

    @Column(name="legal_representative", columnDefinition = "VARCHAR(128) COMMENT '法定代表人'")
    private String legalRepresentative;

    @Column(name="principal", columnDefinition = "VARCHAR(128) COMMENT '负责人'")
    private String principal;

    @Type(type="java.lang.Float")
    @Column(name="registered_capital", columnDefinition = "FLOAT COMMENT '注册资本'")
    private Float registeredCapital;

    @Column(name="currency", columnDefinition = "VARCHAR(32) COMMENT '币种'")
    private String currency;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="setup_date", columnDefinition = "DATE COMMENT '成立日期'")
    private Date setupDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="achieve_date", columnDefinition = "DATE COMMENT '取得日期'")
    private Date achieveDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="operating_period_from", columnDefinition = "DATE COMMENT '营业期限自'")
    private Date operatingPeriodFrom;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="operating_period_end", columnDefinition = "DATE COMMENT '营业期限至'")
    private Date operatingPeriodEnd;

    @Column(name="registration_authority", columnDefinition = "VARCHAR(128) COMMENT '登记机关'")
    private String registrationAuthority;

    @Column(name="registration_authority_en", columnDefinition = "VARCHAR(128) COMMENT '英文登记机关'")
    private String registrationAuthorityEn;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="approval_date", columnDefinition = "DATE COMMENT '核准日期'")
    private Date approvalDate;

    @Column(name="registration_status", columnDefinition = "VARCHAR(32) COMMENT '登记状态'")
    private String registrationStatus;

    @Column(name="registration_type", columnDefinition = "VARCHAR(32) COMMENT '企业注册类型'")
    private String registrationType;

    @Column(name="registered_address", columnDefinition = "VARCHAR(128) COMMENT '注册地址'")
    private String registeredAddress;

    @Column(name="registered_address_en", columnDefinition = "VARCHAR(128) COMMENT '英文注册地址'")
    private String registeredAddressEn;

    @Column(name="business_address", columnDefinition = "VARCHAR(128) COMMENT '经营地址'")
    private String businessAddress;

    @Column(name="business_scope", columnDefinition = "TEXT COMMENT '经营范围'")
    private String businessScope;

    @Column(name="business_scope_en", columnDefinition = "TEXT COMMENT '英文经营范围'")
    private String businessScopeEn;

    @Column(name="real_proportion", columnDefinition = "FLOAT COMMENT '实际占比（%）'")
    @Type(type="java.lang.Float")
    private Float realProportion;

    @Column(name="tags", columnDefinition = "VARCHAR(128) COMMENT '标签'")
    private String tags;

    @Column(name="remark", columnDefinition = "TEXT COMMENT '备注信息'")
    private String remark;

    @Column(name="init_ca", columnDefinition = "VARCHAR(8) COMMENT '是否与CA同步过'")
    private String initCa;

    @Column(name="init_invest", columnDefinition = "VARCHAR(8) COMMENT '是否同步过投资公司'")
    private String initInvest;

    @Column(name="business_license_files", columnDefinition = "VARCHAR(64) COMMENT '营业执照'")
    private String businessLicenseFiles;

    @Column(name="approval_files", columnDefinition = "VARCHAR(64) COMMENT '核准文件'")
    private String approvalFiles;

    @Column(name="company_articles_association",columnDefinition = "VARCHAR(64) COMMENT '公司章程'")
    private String companyArticlesAssociation;

    @Column(name="shareholders_decide", columnDefinition = "VARCHAR(64) COMMENT '股东决定'")
    private String shareholdersDecide;

    @Column(name="application_registration_files", columnDefinition = "VARCHAR(64) COMMENT '申请注册文件'")
    private String applicationRegistrationFiles;

    @Column(name="other_files", columnDefinition = "VARCHAR(64) COMMENT '其他文件'")
    private String otherFiles;

}

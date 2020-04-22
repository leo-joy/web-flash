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

@Entity(name="t_lpm_invest_company")
@Data
@Table(appliesTo = "t_lpm_invest_company",comment = "投资企业")
@EntityListeners(AuditingEntityListener.class)
public class InvestCompany extends BaseEntity {

    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="legal_representative", columnDefinition = "VARCHAR(32) COMMENT '法人代表人'")
    private String legalRepresentative;

    @Column(name="branch_company_code", columnDefinition = "VARCHAR(10) COMMENT '分公司编码'")
    @NotBlank(message = "分公司编码不能为空")
    private String branchCompanyCode;

    @Column(name="branch_company_name", columnDefinition = "VARCHAR(300) COMMENT '分公司名称'")
    @NotBlank(message = "分公司名称不能为空")
    private String branchCompanyName;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="setup_date", columnDefinition = "DATE COMMENT '成立日期'")
    private Date setupDate;

    @Column(name="type", columnDefinition = "VARCHAR(32) COMMENT '企业类型'")
    private String type;

    @Column(name="custom_type", columnDefinition = "VARCHAR(32) COMMENT '自定义企业类型'")
    private String customType;

    @Column(name="registration_type", columnDefinition = "VARCHAR(32) COMMENT '注册类型'")
    private String registrationType;

    @Column(name="registration_place", columnDefinition = "VARCHAR(32) COMMENT '企业注册地'")
    private String registrationPlace;

    @Type(type="java.lang.Float")
    @Column(name="registered_capital", columnDefinition = "FLOAT COMMENT '注册资本'")
    private Float registeredCapital;

    @Column(name="currency", columnDefinition = "VARCHAR(32) COMMENT '币种'")
    private String currency;

    @Column(name="registration_status", columnDefinition = "VARCHAR(32) COMMENT '登记状态'")
    private String registrationStatus;

    @Column(name="proportion", columnDefinition = "FLOAT COMMENT '占比（%）'")
    @Type(type="java.lang.Float")
    private Float proportion;

    @Column(name="remark", columnDefinition = "VARCHAR(128) COMMENT '备注信息'")
    private String remark;

    @Type(type="java.lang.Float")
    @Column(name="reality_capital_contribution", columnDefinition = "FLOAT COMMENT '实缴出资额（万元）'")
    private Float realityCapitalContribution;
}

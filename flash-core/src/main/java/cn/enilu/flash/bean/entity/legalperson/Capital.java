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

@Entity(name="t_lpm_capital")
@Data
@Table(appliesTo = "t_lpm_capital",comment = "股东及出资信息")
@EntityListeners(AuditingEntityListener.class)
public class Capital extends BaseEntity {
    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="serial_number", columnDefinition = "VARCHAR(64) COMMENT '序号'")
    private String serialNumber;

    @Column(name="shareholder", columnDefinition = "VARCHAR(128) COMMENT '股东'")
    @NotBlank(message = "股东不能为空")
    private String shareholder;

    @Column(name="subscribed_capital_type", columnDefinition = "VARCHAR(32) COMMENT '认缴出资方式'")
    private String subscribedCapitalType;

    @Type(type="java.lang.Float")
    @Column(name="subscribed_capital_contribution", columnDefinition = "FLOAT COMMENT '认缴出资额（万元）'")
    private Float subscribedCapitalContribution;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="subscribed_capital_date", columnDefinition = "DATE COMMENT '认缴出资日期'")
    private Date subscribedCapitalDate;

    @Column(name="reality_capital_type", columnDefinition = "VARCHAR(32) COMMENT '实缴出资方式'")
    private String realityCapitalType;

    @Type(type="java.lang.Float")
    @Column(name="reality_capital_contribution", columnDefinition = "FLOAT COMMENT '实缴出资额（万元）'")
    private Float realityCapitalContribution;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="reality_capital_date", columnDefinition = "DATE COMMENT '实缴出资日期'")
    private Date realityCapitalDate;

    @Column(name="responsible_person", columnDefinition = "VARCHAR(32) COMMENT '经办人'")
    private String responsiblePerson;

    @Column(name="shareholder_type",columnDefinition = "VARCHAR(32) COMMENT '股东类型'")
    private String shareholderType;

    @Column(name="proportion", columnDefinition = "FLOAT COMMENT '占比（%）'")
    @Type(type="java.lang.Float")
    private Float proportion;

    @Column(columnDefinition = "VARCHAR(32) COMMENT '状态'")
    private String status;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;

    @Column(name="branch_company_code", columnDefinition = "VARCHAR(10) COMMENT '股东编码'")
    private String branchCompanyCode;

    @Column(name="branch_company_name", columnDefinition = "VARCHAR(300) COMMENT '公司股东名称'")
    private String branchCompanyName;

    @Column(name="legal_representative", columnDefinition = "VARCHAR(32) COMMENT '法人代表人'")
    private String legalRepresentative;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="setup_date", columnDefinition = "DATE COMMENT '成立日期'")
    private Date setupDate;

    @Column(name="type", columnDefinition = "VARCHAR(32) COMMENT '企业类型'")
    private String type;

    @Column(name="custom_type", columnDefinition = "VARCHAR(32) COMMENT '自定义企业类型'")
    private String customType;

    @Column(name="shareholder_mold", columnDefinition = "Integer COMMENT '股东分类'")
    private Integer shareholderMold;

    @Column(name="registration_type", columnDefinition = "VARCHAR(32) COMMENT '企业注册类型'")
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

    @Column(name="remark", columnDefinition = "VARCHAR(128) COMMENT '备注信息'")
    private String remark;
}

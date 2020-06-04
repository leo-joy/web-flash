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

@Entity(name="t_lpm_capital_modify")
@Data
@Table(appliesTo = "t_lpm_capital_modify",comment = "股东及出资信息变更")
@EntityListeners(AuditingEntityListener.class)
public class CapitalModify extends BaseEntity {
    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="serial_Id_modify", columnDefinition = "VARCHAR(32) COMMENT '变更序号'")
    private String serialIdModify;

    @Column(name="modify_status_type", columnDefinition = "VARCHAR(32) COMMENT '是否是新变更'")
    private String modifyStatusType;

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

    @Column(name="shareholder_mold",columnDefinition = "VARCHAR(32) COMMENT '股东类型'")
    private String shareholderMold;

    @Column(name="shareholder_type",columnDefinition = "VARCHAR(32) COMMENT '股东类型'")
    private String shareholderType;

    @Column(name="proportion", columnDefinition = "FLOAT COMMENT '占比（%）'")
    @Type(type="java.lang.Float")
    private Float proportion;

    @Column(columnDefinition = "VARCHAR(32) COMMENT '状态'")
    private String status;

    @Column(name="branch_company_code", columnDefinition = "VARCHAR(10) COMMENT '股东编码'")
    private String branchCompanyCode;

    @Column(name="branch_company_name", columnDefinition = "VARCHAR(300) COMMENT '公司股东名称'")
    private String branchCompanyName;

}

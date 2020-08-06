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
import java.math.BigDecimal;
import java.util.Date;

@Entity(name="t_lpm_reality_record")
@Data
@Table(appliesTo = "t_lpm_reality_record",comment = "股东实缴记录信息")
@EntityListeners(AuditingEntityListener.class)
public class RealityRecord extends BaseEntity {
    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="serial_number", columnDefinition = "VARCHAR(64) COMMENT '股权序号'")
    private String serialNumber;

    @Column(name="shareholder", columnDefinition = "VARCHAR(128) COMMENT '股东'")
    @NotBlank(message = "股东不能为空")
    private String shareholder;

    @Column(name="reality_capital_type", columnDefinition = "VARCHAR(32) COMMENT '实缴出资方式'")
    private String realityCapitalType;

    @Type(type="java.math.BigDecimal")
    @Column(name="reality_capital_contribution", columnDefinition = "DECIMAL COMMENT '实缴出资额（万元）'")
    private BigDecimal realityCapitalContribution;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="reality_capital_date", columnDefinition = "DATE COMMENT '实缴出资日期'")
    private Date realityCapitalDate;

    @Type(type="java.math.BigDecimal")
    @Column(name="number_of_shares", columnDefinition = "DECIMAL COMMENT '实缴数量'")
    private BigDecimal numberOfShares;

    @Column(name="currency", columnDefinition = "VARCHAR(32) COMMENT '币种'")
    private String currency;

    @Column(name="responsible_person", columnDefinition = "VARCHAR(32) COMMENT '经办人'")
    private String responsiblePerson;

    @Column(name="remark", columnDefinition = "VARCHAR(128) COMMENT '备注信息'")
    private String remark;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

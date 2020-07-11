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

@Entity(name="t_lpm_stock_pledge")
@Data
@Table(appliesTo = "t_lpm_stock_pledge",comment = "股权出质登记信息")
@EntityListeners(AuditingEntityListener.class)
public class StockPledge extends BaseEntity {
    @Column(name="serial_number", columnDefinition = "VARCHAR(64) COMMENT '序号'")
    private String serialNumber;

    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="register_code", columnDefinition = "VARCHAR(64) COMMENT '登记编号'")
    private String registerCode;

    @Column(name="pledgor", columnDefinition = "VARCHAR(128) COMMENT '出质人'")
    @NotBlank(message = "出质人不能为空")
    private String pledgor;

    @Column(name="pledgor_certificate_number", columnDefinition = "VARCHAR(64) COMMENT '证照/证件号码(出质人)'")
    @NotBlank(message = "证照/证件号码不能为空")
    private String pledgorCertificateNumber;

    @Type(type="java.lang.Float")
    @Column(name="pledge_stock_contribution", columnDefinition = "FLOAT COMMENT '出质股权数额'")
    private Float pledgeStockContribution;

    @Column(name="pledgee", columnDefinition = "VARCHAR(128) COMMENT '质权人'")
    @NotBlank(message = "质权人不能为空")
    private String pledgee;

    @Column(name="pledgee_certificate_number", columnDefinition = "VARCHAR(64) COMMENT '证照/证件号码(质权人)'")
    @NotBlank(message = "证照/证件号码不能为空")
    private String pledgeeCertificateNumber;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="stock_pledge_register_date", columnDefinition = "DATE COMMENT '股权出质设立登记日期'")
    private Date stockPledgeRegisterDate;

    @Column(columnDefinition = "VARCHAR(32) COMMENT '状态'")
    private String status;

    @Column(name="responsible_person", columnDefinition = "VARCHAR(32) COMMENT '经办人'")
    private String responsiblePerson;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

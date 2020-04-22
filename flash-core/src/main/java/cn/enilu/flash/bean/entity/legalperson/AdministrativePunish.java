package cn.enilu.flash.bean.entity.legalperson;

import cn.enilu.flash.bean.entity.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Table;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Entity(name="t_lpm_administrative_punish")
@Data
@Table(appliesTo = "t_lpm_administrative_punish",comment = "行政处罚信息")
@EntityListeners(AuditingEntityListener.class)
public class AdministrativePunish extends BaseEntity {
    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="serial_number", columnDefinition = "VARCHAR(64) COMMENT '序号'")
    private String serialNumber;

    @Column(name="decision_reference_number", columnDefinition = "VARCHAR(64) COMMENT '决定书文号'")
    private String decisionReferenceNumber;

    @Column(name="unlawful_act_type", columnDefinition = "VARCHAR(32) COMMENT '违法行为类型'")
    private String unlawfulActType;

    @Column(name="administrative_punish_content", columnDefinition = "TEXT COMMENT '行政处罚内容'")
    @NotBlank(message = "行政处罚内容不能为空")
    private String administrativePunishContent;

    @Column(name="decision_org_name", columnDefinition = "VARCHAR(128) COMMENT '决定机关名称'")
    private String decisionOrgName;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="validity_from", columnDefinition = "DATE COMMENT '处罚决定日期'")
    private Date validityFrom;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="publicity_date", columnDefinition = "DATE COMMENT '公示日期'")
    private Date publicityDate;

    @Column(name="remark", columnDefinition = "TEXT COMMENT '备注'")
    private String remark;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

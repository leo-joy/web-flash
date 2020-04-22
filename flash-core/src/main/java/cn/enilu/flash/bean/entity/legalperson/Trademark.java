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

@Entity(name="t_lpm_trademark")
@Data
@Table(appliesTo = "t_lpm_trademark",comment = "商标信息")
@EntityListeners(AuditingEntityListener.class)
public class Trademark extends BaseEntity {
    @Column(name="serial_number", columnDefinition = "VARCHAR(64) COMMENT '序号'")
    @NotBlank(message = "序号不能为空")
    private String serialNumber;

    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="trademark_register_code", columnDefinition = "VARCHAR(64) COMMENT '注册号'")
    @NotBlank(message = "注册号不能为空")
    private String trademarkRegisterCode;

    @Column(name="trademark_name", columnDefinition = "VARCHAR(64) COMMENT '商标名称'")
    @NotBlank(message = "商标名称不能为空")
    private String trademarkName;

    @Column(name="trademark_type", columnDefinition = "VARCHAR(32) COMMENT '类别'")
    private String trademarkType;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="trademark_register_date", columnDefinition = "DATE COMMENT '注册日期'")
    private Date trademarkRegisterDate;

    @Column(name="responsible_person", columnDefinition = "VARCHAR(32) COMMENT '经办人'")
    @NotBlank(message = "经办人不能为空")
    private String responsiblePerson;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

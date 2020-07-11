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

@Entity(name="t_lpm_seal")
@Data
@Table(appliesTo = "t_lpm_seal",comment = "印章信息")
@EntityListeners(AuditingEntityListener.class)
public class Seal extends BaseEntity {

    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="serial_number", columnDefinition = "VARCHAR(64) COMMENT '序号'")
    private String serialNumber;

    @Column(name="seal_name", columnDefinition = "VARCHAR(128) COMMENT '印章名称'")
    @NotBlank(message = "印章名称不能为空")
    private String sealName;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="active_date", columnDefinition = "DATE COMMENT '启用日期'")
    private Date activeDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="obsolete_date", columnDefinition = "DATE COMMENT '作废日期'")
    private Date obsoleteDate;

    @Column(columnDefinition = "VARCHAR(32) COMMENT '状态'")
    private String status;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

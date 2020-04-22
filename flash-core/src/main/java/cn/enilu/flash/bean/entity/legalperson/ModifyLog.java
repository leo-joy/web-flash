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

@Entity(name="t_lpm_modify_log")
@Data
@Table(appliesTo = "t_lpm_modify_log",comment = "业务修改信息")
@EntityListeners(AuditingEntityListener.class)
public class ModifyLog extends BaseEntity {
    @Column(name="call_system", columnDefinition = "VARCHAR(64) COMMENT '调用系统'")
    @NotBlank(message = "调用系统不能为空")
    private String callSystem;

    @Column(name="call_system_name", columnDefinition = "VARCHAR(64) COMMENT '调用系统名称'")
    @NotBlank(message = "调用系统名称不能为空")
    private String callSystemName;

    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="table_code", columnDefinition = "VARCHAR(64) COMMENT '所属表'")
    @NotBlank(message = "所属表不能为空")
    private String tableCode;

    @Column(name="table_name", columnDefinition = "VARCHAR(64) COMMENT '所属表名称'")
    @NotBlank(message = "所属表名称不能为空")
    private String tableName;

    @Column(name="field_code", columnDefinition = "VARCHAR(64) COMMENT '所属字段'")
    @NotBlank(message = "所属字段不能为空")
    private String fieldCode;

    @Column(name="field_name", columnDefinition = "VARCHAR(64) COMMENT '所属字段名称'")
    @NotBlank(message = "所属字段名称不能为空")
    private String fieldName;

    @Column(name="field_old_value", columnDefinition = "VARCHAR(1000) COMMENT '字段历史值'")
    private String fieldOldValue;

    @Column(name="field_new_value", columnDefinition = "VARCHAR(1000) COMMENT '字段新值'")
    private String fieldNewValue;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

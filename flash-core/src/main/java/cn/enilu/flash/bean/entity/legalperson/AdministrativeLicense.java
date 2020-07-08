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

@Entity(name="t_lpm_administrative_license")
@Data
@Table(appliesTo = "t_lpm_administrative_license",comment = "行政许可信息")
@EntityListeners(AuditingEntityListener.class)
public class AdministrativeLicense extends BaseEntity {
    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="serial_number", columnDefinition = "VARCHAR(64) COMMENT '序号'")
    private String serialNumber;

    @Column(name="permission_file_code", columnDefinition = "VARCHAR(64) COMMENT '许可文件编号'")
    private String permissionFileCode;

    @Column(name="permission_file_name", columnDefinition = "VARCHAR(128) COMMENT '许可文件名称'")
    @NotBlank(message = "许可文件名称不能为空")
    private String permissionFileName;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="validity_from", columnDefinition = "DATE COMMENT '有效期自'")
    private Date validityFrom;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="validity_end", columnDefinition = "DATE COMMENT '有效日期至'")
    private Date validityEnd;

    @Column(name="permission_org", columnDefinition = "VARCHAR(128) COMMENT '许可机关'")
    @NotBlank(message = "许可机关不能为空")
    private String permissionOrg;

    @Column(name="permission_content", columnDefinition = "TEXT COMMENT '许可内容'")
    private String permissionContent;

    @Column(columnDefinition = "VARCHAR(32) COMMENT '状态'")
    private String status;

    @Column(name="responsible_person", columnDefinition = "VARCHAR(32) COMMENT '经办人'")
    private String responsiblePerson;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

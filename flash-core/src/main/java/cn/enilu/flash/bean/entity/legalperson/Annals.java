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

@Entity(name="t_lpm_annals")
@Data
@Table(appliesTo = "t_lpm_annals",comment = "企业年报信息")
@EntityListeners(AuditingEntityListener.class)
public class Annals extends BaseEntity {

    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="serial_number", columnDefinition = "VARCHAR(64) COMMENT '序号'")
    private String serialNumber;

    @Column(name="submission_year", columnDefinition = "INT COMMENT '报送年度'")
    private Integer submissionYear;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="submission_date", columnDefinition = "DATE COMMENT '报送日期'")
    private Date submissionDate;

    @Column(name="responsible_person", columnDefinition = "VARCHAR(32) COMMENT '经办人'")
    private String responsiblePerson;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

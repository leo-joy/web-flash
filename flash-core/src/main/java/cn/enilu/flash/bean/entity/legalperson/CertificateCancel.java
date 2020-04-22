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

@Entity(name="t_lpm_certificate_cancel")
@Data
@Table(appliesTo = "t_lpm_certificate_cancel",comment = "证照作废声明")
@EntityListeners(AuditingEntityListener.class)
public class CertificateCancel extends BaseEntity {
    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="serial_number", columnDefinition = "VARCHAR(64) COMMENT '序号'")
    private String serialNumber;

    @Column(name="transcript_status", columnDefinition = "VARCHAR(32) COMMENT '是否正副本'")
    private String transcriptStatus;

    @Column(name="transcript_code", columnDefinition = "VARCHAR(64) COMMENT '副本编号'")
    private String transcriptCode;

    @Column(name="statement_content", columnDefinition = "TEXT COMMENT '声明内容'")
    @NotBlank(message = "声明内容不能为空")
    private String statementContent;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="statement_date", columnDefinition = "DATE COMMENT '声明日期'")
    private Date statementDate;

    @Column(name="replace_status", columnDefinition = "VARCHAR(32) COMMENT '是否补领'")
    private String replaceStatus;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="publicity_date", columnDefinition = "DATE COMMENT '补领日期'")
    private Date publicityDate;

    @Column(name="responsible_person", columnDefinition = "VARCHAR(32) COMMENT '经办人'")
    private String responsiblePerson;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

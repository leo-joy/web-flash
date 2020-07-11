package cn.enilu.flash.bean.entity.legalperson;

import cn.enilu.flash.bean.entity.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Table;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.validation.constraints.NotBlank;

@Entity(name="t_lpm_knowledge_pledge")
@Data
@Table(appliesTo = "t_lpm_knowledge_pledge",comment = "知识产权出质登记信息")
@EntityListeners(AuditingEntityListener.class)
public class KnowledgePledge extends BaseEntity {
    @Column(name="serial_number", columnDefinition = "VARCHAR(64) COMMENT '序号'")
    private String serialNumber;

    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="property_register_code", columnDefinition = "VARCHAR(64) COMMENT '知识产权登记证号'")
    @NotBlank(message = "知识产权登记证号不能为空")
    private String propertyRegisterCode;

    @Column(name="property_name", columnDefinition = "VARCHAR(128) COMMENT '名称'")
    @NotBlank(message = "名称不能为空")
    private String propertyName;

    @Column(name="property_type", columnDefinition = "VARCHAR(32) COMMENT '种类'")
    private String propertyType;

    @Column(name="pledgor_name", columnDefinition = "VARCHAR(128) COMMENT '出质人名称'")
    @NotBlank(message = "出质人名称不能为空")
    private String pledgorName;

    @Column(name="pledgee_name", columnDefinition = "VARCHAR(128) COMMENT '质权人名称'")
    @NotBlank(message = "质权人名称不能为空")
    private String pledgeeName;

    @Column(name="pledgee_certificate_number", columnDefinition = "INT COMMENT '质权登记期限'")
    private Integer pledgeeCertificateNumber;

    @Column(columnDefinition = "VARCHAR(32) COMMENT '状态'")
    private String status;

    @Column(name="responsible_person", columnDefinition = "VARCHAR(32) COMMENT '经办人'")
    private String responsiblePerson;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

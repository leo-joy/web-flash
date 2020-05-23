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

@Entity(name="t_lpm_tallage")
@Data
@Table(appliesTo = "t_lpm_tallage",comment = "税务信息")
@EntityListeners(AuditingEntityListener.class)
public class Tallage extends BaseEntity {
    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="duty_paragraph", columnDefinition = "VARCHAR(64) COMMENT '税务登记号'")
    @NotBlank(message = "税务登记号不能为空")
    private String dutyParagraph;

    @Column(name="address", columnDefinition = "VARCHAR(128) COMMENT '地址'")
    private String address;

    @Column(name="phone", columnDefinition = "VARCHAR(32) COMMENT '电话'")
    private String phone;

    @Column(name="open_account_bank", columnDefinition = "VARCHAR(64) COMMENT '开户行'")
    private String openAccountBank;

    @Column(name="bank_account", columnDefinition = "VARCHAR(64) COMMENT '银行账号'")
    private String bankAccount;

    @Column(name="levy_type", columnDefinition = "VARCHAR(16) COMMENT '征收方式'")
    private String levyType;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

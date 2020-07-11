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

@Entity(name="t_lpm_property_pledge")
@Data
@Table(appliesTo = "t_lpm_property_pledge",comment = "动产抵押登记信息")
@EntityListeners(AuditingEntityListener.class)
public class PropertyPledge extends BaseEntity {
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

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="register_date", columnDefinition = "DATE COMMENT '登记日期'")
    private Date registerDate;

    @Column(name="register_org", columnDefinition = "VARCHAR(128) COMMENT '登记机关'")
    @NotBlank(message = "登记机关不能为空")
    private String registerOrg;

    @Type(type="java.lang.Float")
    @Column(name="by_assure_bond_contribution", columnDefinition = "FLOAT COMMENT '被担保债权数额'")
    private Float byAssureBondContribution;

    @Column(columnDefinition = "VARCHAR(32) COMMENT '状态'")
    private String status;

    @Column(name="responsible_person", columnDefinition = "VARCHAR(32) COMMENT '经办人'")
    private String responsiblePerson;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

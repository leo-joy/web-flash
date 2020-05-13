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

@Entity(name="t_lpm_company_modify")
@Data
@Table(appliesTo = "t_lpm_company_modify",comment = "企业变更")
@EntityListeners(AuditingEntityListener.class)
public class CompanyModify extends BaseEntity {
    @Column
    private String pid;

    @Column
    private String pName;

    @Column
    private String pIds;

    @Column(name="affiliated_unit", columnDefinition = "VARCHAR(128) COMMENT '所属单位'")
    private String affiliatedUnit;

    @Column(name="apply_department", columnDefinition = "VARCHAR(128) COMMENT '申请部门'")
    private String applyDepartment;

    @Column(name="applicant", columnDefinition = "VARCHAR(128) COMMENT '申请人'")
    private String applicant;

    @Column(name="apply_time", columnDefinition = "VARCHAR(128) COMMENT '申请时间'")
    private String applyTime;

    @Column(name="applicant_contact", columnDefinition = "VARCHAR(64) COMMENT '办理人联系方式'")
    private String applicantContact;

    @Column(name="apply_type", columnDefinition = "VARCHAR(32) COMMENT '申请类型'")
    private String applyType;

    @Column(name="apply_reason", columnDefinition = "VARCHAR(256) COMMENT '申请理由'")
    private String applyReason;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="modify_date", columnDefinition = "DATE COMMENT '变更日期'")
    private Date modifyDate;

    @Column(name="syn_state", columnDefinition = "VARCHAR(32) COMMENT '同步状态'")
    private String synState;



    @Column(name="enterprise_id", columnDefinition = "VARCHAR(128) COMMENT '企业id'")
    private String enterpriseId;

    @Column(name="enterprise_name_state", columnDefinition = "VARCHAR(32) COMMENT '企业名称变更状态'")
    private String enterpriseNameState;

    @Column(name="enterprise_name_old", columnDefinition = "VARCHAR(128) COMMENT '旧企业名称'")
    private String enterpriseNameOld;

    @Column(name="enterprise_name_new", columnDefinition = "VARCHAR(128) COMMENT '新企业名称'")
    private String enterpriseNameNew;


    @Column(name="registered_address_state", columnDefinition = "VARCHAR(32) COMMENT '注册地址变更状态'")
    private String registeredAddressState;

    @Column(name="registered_address_old", columnDefinition = "VARCHAR(128) COMMENT '旧注册地址'")
    private String registeredAddressOld;

    @Column(name="registered_address_new", columnDefinition = "VARCHAR(128) COMMENT '新注册地址'")
    private String registeredAddressNew;


    @Column(name="business_scope_state", columnDefinition = "VARCHAR(32) COMMENT '经营范围变更状态'")
    private String businessScopeState;

    @Column(name="business_scope_old", columnDefinition = "TEXT COMMENT '旧经营范围'")
    private String businessScopeOld;

    @Column(name="business_scope_new", columnDefinition = "TEXT COMMENT '新经营范围'")
    private String businessScopeNew;


    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

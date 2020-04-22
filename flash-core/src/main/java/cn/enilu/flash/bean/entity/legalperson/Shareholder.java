package cn.enilu.flash.bean.entity.legalperson;

import cn.enilu.flash.bean.entity.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Table;
import org.hibernate.annotations.Type;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.validation.constraints.NotBlank;

@Entity(name="t_lpm_shareholder")
@Data
@Table(appliesTo = "t_lpm_shareholder",comment = "股东信息")
@EntityListeners(AuditingEntityListener.class)
public class Shareholder extends BaseEntity {

    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="shareholder", columnDefinition = "VARCHAR(128) COMMENT '股东'")
    @NotBlank(message = "股东不能为空")
    private String chairman;

    @Column(name="proportion", columnDefinition = "FLOAT COMMENT '占比（%）'")
    @Type(type="java.lang.Float")
    private Float proportion;

    @Column(columnDefinition = "VARCHAR(32) COMMENT '类型'")
    private String type;

    @Column(columnDefinition = "VARCHAR(32) COMMENT '状态'")
    private String status;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

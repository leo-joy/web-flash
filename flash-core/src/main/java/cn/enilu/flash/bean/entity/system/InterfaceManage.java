package cn.enilu.flash.bean.entity.system;

import cn.enilu.flash.bean.entity.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Table;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.validation.constraints.NotBlank;

/**
 * Created  on 2018/4/2 0002.
 *
 * @author enilu
 */
@Entity(name = "t_sys_interface_manage")
@Table(appliesTo = "t_sys_interface_manage",comment = "接口管理")
@Data
@EntityListeners(AuditingEntityListener.class)
public class InterfaceManage extends BaseEntity {
    @Column(columnDefinition = "VARCHAR(32) COMMENT '系统编号'")
    private String code;
    @Column(columnDefinition = "VARCHAR(64) COMMENT '系统名称'",nullable = false)
    @NotBlank(message = "系统名称不能为空")
    private String name;
    @Column(columnDefinition = "VARCHAR(128) COMMENT '接口地址'")
    private String url;
    @Column(columnDefinition = "TEXT COMMENT '调用接口描述'")
    private String description;
    @Column(columnDefinition = "INT COMMENT '状态1:启用,0:禁用'",nullable = false)
    private Integer status;
    @Column(columnDefinition = "VARCHAR(64) COMMENT '接口凭证'")
    private String token;
}

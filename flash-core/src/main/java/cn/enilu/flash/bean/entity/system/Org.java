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
 * Created  on 2020/6/16 0002.
 *
 * @author enilu
 */
@Entity(name="t_sys_org")
@Table(appliesTo = "t_sys_org",comment = "组织")
@Data
@EntityListeners(AuditingEntityListener.class)
public class Org extends BaseEntity {
    @Column
    private Integer num;
    @Column
    private Long mid;
    @Column
    private Long pid;
    @Column
    private String pids;
    @Column
    @NotBlank(message = "组织简称不能为空")
    private String simplename;
    @Column
    @NotBlank(message = "组织全称不能为空")
    private String fullname;
    @Column
    private String tips;
    @Column
    private Integer version;

    // HR系统 公司/部门接口返回数据
    @Column(name="pk_corp", columnDefinition = "VARCHAR(128) COMMENT '主键编号'")
    private String pkCorp;
    @Column(name="isseal", columnDefinition = "VARCHAR(128) COMMENT '是否封存'")
    private String isseal;
    @Column(name="ts", columnDefinition = "VARCHAR(128) COMMENT '更新时间'")
    private String ts;


}

package cn.enilu.flash.bean.entity.legalperson;

import cn.enilu.flash.bean.entity.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Table;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.validation.constraints.NotBlank;

@Entity(name="t_lpm_main_member")
@Data
@Table(appliesTo = "t_lpm_main_member",comment = "主要人员信息")
@EntityListeners(AuditingEntityListener.class)
public class MainMember extends BaseEntity {

    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="chairman_id", columnDefinition = "VARCHAR(32) COMMENT '董事长Id'")
    private String chairmanId;

    @Column(name="chairman", columnDefinition = "VARCHAR(32) COMMENT '董事长'")
    private String chairman;

    @Column(name="director_id", columnDefinition = "VARCHAR(128) COMMENT '董事Id'")
    private String directorId;

    @Column(name="director", columnDefinition = "VARCHAR(128) COMMENT '董事'")
    private String director;

    @Column(name="supervisor_id", columnDefinition = "VARCHAR(128) COMMENT '监事Id'")
    private String supervisorId;

    @Column(name="supervisor", columnDefinition = "VARCHAR(128) COMMENT '监事'")
    private String supervisor;

    @Column(name="general_manager_id", columnDefinition = "VARCHAR(32) COMMENT '总经理Id'")
    private String generalManagerId;

    @Column(name="general_manager", columnDefinition = "VARCHAR(32) COMMENT '总经理'")
    private String generalManager;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

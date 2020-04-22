package cn.enilu.flash.bean.entity.legalperson;

import cn.enilu.flash.bean.entity.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Table;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.validation.constraints.NotBlank;

@Entity(name="t_lpm_liquidation")
@Data
@Table(appliesTo = "t_lpm_liquidation",comment = "清算信息")
@EntityListeners(AuditingEntityListener.class)
public class Liquidation extends BaseEntity {

    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="liquidation_team_leader", columnDefinition = "VARCHAR(32) COMMENT '清算组负责人'")
    @NotBlank(message = "清算组负责人不能为空")
    private String liquidationTeamLeader;

    @Column(name="liquidation_team_member", columnDefinition = "VARCHAR(300) COMMENT '清算组成员'")
    private String liquidationTeamMember;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

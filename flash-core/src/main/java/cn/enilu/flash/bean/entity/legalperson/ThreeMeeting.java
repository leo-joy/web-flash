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

@Entity(name="t_lpm_three_meeting")
@Data
@Table(appliesTo = "t_lpm_three_meeting",comment = "三会管理")
@EntityListeners(AuditingEntityListener.class)
public class ThreeMeeting extends BaseEntity {

    @Column(name="enterprise_code", columnDefinition = "VARCHAR(64) COMMENT '所属企业编码'")
    @NotBlank(message = "所属企业编码不能为空")
    private String enterpriseCode;

    @Column(name="enterprise_name", columnDefinition = "VARCHAR(64) COMMENT '所属企业名称'")
    @NotBlank(message = "所属企业名称不能为空")
    private String enterpriseName;

    @Column(name="title", columnDefinition = "VARCHAR(32) COMMENT '会议标题'")
    private String title;

    @Column(name="issue", columnDefinition = "TEXT COMMENT '会议议题'")
    private String issue;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="meeting_date", columnDefinition = "DATE COMMENT '开会日期'")
    private Date meetingDate;

    @Column(name="organizers", columnDefinition = "VARCHAR(32) COMMENT '组织者'")
    private String organizers;

    @Column(name="organizers_id", columnDefinition = "VARCHAR(32) COMMENT '组织者id'")
    private String organizersId;

    @Column(name="conference_participant", columnDefinition = "VARCHAR(256) COMMENT '参会人员'")
    private String conferenceParticipant;

    @Column(name="conference_participant_id", columnDefinition = "VARCHAR(128) COMMENT '参会人员id'")
    private String conferenceParticipantId;

    @Column(name="meeting_type", columnDefinition = "VARCHAR(8) COMMENT '会议类型'")
    private String meetingType;

    @Column(name="meeting_conclusion", columnDefinition = "TEXT COMMENT '会议总结'")
    private String meetingConclusion;

    @Column(name="remark", columnDefinition = "TEXT COMMENT '备注信息'")
    private String remark;

    @Column(name="meeting_files", columnDefinition = "VARCHAR(128) COMMENT '会议文件'")
    private String meetingFiles;

    @Column(name="accessory_files", columnDefinition = "VARCHAR(128) COMMENT '详情'")
    private String accessoryFiles;
}

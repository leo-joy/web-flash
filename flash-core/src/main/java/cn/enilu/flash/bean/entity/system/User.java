package cn.enilu.flash.bean.entity.system;

import cn.enilu.flash.bean.entity.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Table;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import java.util.Date;

/**
 * Created  on 2018/4/2 0002.
 *
 * @author enilu
 */
@Entity(name = "t_sys_user")
@Table(appliesTo = "t_sys_user",comment = "账号")
@Data
@EntityListeners(AuditingEntityListener.class)
public class User  extends BaseEntity {
    @Column
    private String avatar;
    @Column(columnDefinition = "VARCHAR(32) COMMENT '账户'")
    private String account;
    @Column(columnDefinition = "VARCHAR(64) COMMENT '密码'")
    private String password;
    @Column(columnDefinition = "VARCHAR(16) COMMENT '密码盐'")
    private String salt;
    @Column(columnDefinition = "VARCHAR(64) COMMENT '姓名'")
    private String name;
    @Column
    private Date birthday;
    @Column
    private Integer sex;
    @Column(columnDefinition = "VARCHAR(64) COMMENT 'email'")
    private String email;
    @Column(columnDefinition = "VARCHAR(32) COMMENT '手机号'")
    private String phone;
    @Column(columnDefinition = "VARCHAR(128) COMMENT '角色id列表，以逗号分隔'")
    private String roleid;
    @Column
    private Long deptid;
    @Column
    private Integer status;
    @Column
    private Integer version;

    @Column(columnDefinition = "VARCHAR(32) COMMENT '学历'")
    private String academic;
    @Column(columnDefinition = "VARCHAR(32) COMMENT '专业'")
    private String specialty;
    @Column(columnDefinition = "VARCHAR(32) COMMENT '职称'")
    private String post;
    @Column(columnDefinition = "VARCHAR(32) COMMENT '职务'")
    private String duty;
    @Column(name="experience", columnDefinition = "TEXT COMMENT '工作经历'")
    private String experience;
    @Column(columnDefinition = "VARCHAR(32) COMMENT '用户类型'")
    private String type;

    @Column(name="work_number", columnDefinition = "VARCHAR(32) COMMENT '工号'")
    private String workNumber;
    @Column(name="english_surnames", columnDefinition = "VARCHAR(32) COMMENT '英文姓氏'")
    private String englishSurnames;
    @Column(name="english_name", columnDefinition = "VARCHAR(32) COMMENT '英文名字'")
    private String englishName;
    @Column(name="chinese_name_before", columnDefinition = "VARCHAR(32) COMMENT '前用中文名'")
    private String chineseNameBefore;
    @Column(name="english_name_before", columnDefinition = "VARCHAR(32) COMMENT '前用英文名'")
    private String englishNameBefore;
    @Column(name="chinese_name_alias", columnDefinition = "VARCHAR(32) COMMENT '别名中文名'")
    private String chineseNameAlias;
    @Column(name="english_name_alias", columnDefinition = "VARCHAR(32) COMMENT '别名英文名'")
    private String englishNameAlias;
    @Column(name="address", columnDefinition = "VARCHAR(128) COMMENT '通讯地址'")
    private String address;
    @Column(name="region", columnDefinition = "VARCHAR(32) COMMENT '地区'")
    private String region;
    @Column(name="identity_card_chinese", columnDefinition = "VARCHAR(32) COMMENT '内地身份证'")
    private String identityCardChinese;
    @Column(name="identity_card_hk", columnDefinition = "VARCHAR(32) COMMENT '香港身份证'")
    private String identityCardHk;
    @Column(name="passport_no", columnDefinition = "VARCHAR(32) COMMENT '护照号码'")
    private String passportNo;
    @Column(name="passport_national", columnDefinition = "VARCHAR(300) COMMENT '护照签发国家'")
    private String passportNational;

    // HR系统 接口返回数据
    /*
    * {   jobstnd: '文员/司机等',
          poststat: '在职',
          sex: '男',
          pk_corp: '00016A100000000RMQ7F',
          jobname: '董事司机',
          psnname: '曾慶峯',
          pk_psnbasdoc: '00016A1000000000M1EH',
          email: 'fung.tsang@agile.com.cn',
          pk_deptdoc: '10016A1000000000UZU4',
          psncode: 'A026493',
          mobile: '61288211' }
    **/

    @Column(name="job_stnd", columnDefinition = "VARCHAR(128) COMMENT '职位类型'")
    private String jobStnd;
    @Column(name="job_name", columnDefinition = "VARCHAR(64) COMMENT '职位'")
    private String jobName;
    @Column(name="post_stat", columnDefinition = "VARCHAR(8) COMMENT '在职状态'")
    private String postStat;
    @Column(name="sex_name", columnDefinition = "VARCHAR(8) COMMENT '中文性别'")
    private String sexName;
    @Column(name="pk_corp", columnDefinition = "VARCHAR(128) COMMENT '公司编号'")
    private String pkCorp;
    @Column(name="pk_deptdoc", columnDefinition = "VARCHAR(128) COMMENT '部门编号'")
    private String pkDeptdoc;
}

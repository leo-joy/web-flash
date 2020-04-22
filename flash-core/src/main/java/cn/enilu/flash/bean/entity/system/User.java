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
    @Column(columnDefinition = "VARCHAR(16) COMMENT '手机号'")
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
}

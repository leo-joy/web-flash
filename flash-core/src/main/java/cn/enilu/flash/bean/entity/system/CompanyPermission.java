package cn.enilu.flash.bean.entity.system;

import lombok.Data;
import org.hibernate.annotations.Table;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Created  on 2019/12/19 0002.
 *
 * @author zhanglei
 */
@Entity(name = "t_sys_company_permission")
@Table(appliesTo = "t_sys_company_permission",comment = "公司角色关系")
@Data
public class CompanyPermission {
    @Id
    @GeneratedValue
    private Long id;

    @Column
    private Long companyid;
    @Column
    private Long roleid;

}
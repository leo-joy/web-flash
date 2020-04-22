package cn.enilu.flash.dao.legalperson;


import cn.enilu.flash.bean.entity.legalperson.BusinessLicense;
import cn.enilu.flash.dao.BaseRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface BusinessLicenseRepository extends BaseRepository<BusinessLicense,Long>{
    @Query(nativeQuery = true,value="SELECT m1.id AS id " +
            " FROM t_lpm_business_license m1 INNER " +
            "JOIN ( SELECT ID FROM t_lpm_business_license WHERE ID IN ( SELECT companyid FROM t_sys_company_permission rela WHERE rela.roleid IN (?1))) m3 ON m1.id = m3.ID ORDER BY id ASC")
    List getCompanysByRoleIds(List<Long> roleList);
}


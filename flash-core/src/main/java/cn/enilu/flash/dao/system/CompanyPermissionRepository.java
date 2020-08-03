package cn.enilu.flash.dao.system;


import cn.enilu.flash.bean.entity.system.CompanyPermission;
import cn.enilu.flash.dao.BaseRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;


public interface CompanyPermissionRepository extends BaseRepository<CompanyPermission,Long>{
    @Transactional
    @Modifying
    @Query(nativeQuery = true,value = "delete from t_sys_company_permission where roleid=?1")
    int deleteByRoleId(Long roleId);

    @Transactional
    @Modifying
    @Query(nativeQuery = true,value = "delete from t_sys_company_permission where roleid=?1 and companyid=?2")
    int deleteByRoleIdAndCompanyId(Long roleId, Long companyId);
}


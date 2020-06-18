package cn.enilu.flash.dao.system;


import cn.enilu.flash.bean.entity.system.Org;
import cn.enilu.flash.dao.BaseRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Created  on 2018/3/21 0021.
 *
 * @author enilu
 */
public interface OrgRepository  extends BaseRepository<Org, Long> {
    List<Org> findByPidsLike(String pid);
    @Query(nativeQuery = true,value = "SELECT id, pid AS pId, simplename AS NAME, ( CASE WHEN (pId = 0 OR pId IS NULL) THEN 'true' ELSE 'false' END ) AS isOpen FROM t_sys_org")
    List tree();

    List<Org> findBySimplenameLikeOrFullnameLike(String name,String name2);
}

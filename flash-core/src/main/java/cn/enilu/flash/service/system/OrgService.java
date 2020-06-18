package cn.enilu.flash.service.system;

import cn.enilu.flash.bean.entity.system.Org;
import cn.enilu.flash.bean.vo.node.OrgNode;
import cn.enilu.flash.bean.vo.node.ZTreeNode;
import cn.enilu.flash.dao.system.OrgRepository;
import cn.enilu.flash.service.BaseService;
import com.google.common.base.Strings;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created  on 2018/3/21 0021.
 *
 * @author enilu
 */
@Service
public class OrgService extends BaseService<Org,Long,OrgRepository> {
    @Autowired
    private OrgRepository orgRepository;

    public List<ZTreeNode> tree() {
        List<Object[]> list = orgRepository.tree();
        List<ZTreeNode> nodes = new ArrayList<>();
        for(Object[] obj:list){
            ZTreeNode node = transfer(obj);
            nodes.add(node);
        }
        return nodes;
    }

    private ZTreeNode transfer(Object[] obj){
        ZTreeNode node = new ZTreeNode();
        node.setId(Long.valueOf(obj[0].toString()));
        node.setpId(Long.valueOf(obj[1].toString()));
        node.setName(obj[2].toString());
        node.setIsOpen(Boolean.valueOf(obj[3].toString()));
        return node;
    }
    public List<Org> query(String condition) {
        List<Org> list = new ArrayList<>();
        if(Strings.isNullOrEmpty(condition)){
            list = (List<Org>) orgRepository.findAll();
        }else{
            condition = "%"+condition+"%";
            list = orgRepository.findBySimplenameLikeOrFullnameLike(condition,condition);
        }
        return list;
    }

    public void deleteOrg(Long orgId) {
        Org org = get(orgId);

        List<Org> subOrgs = orgRepository.findByPidsLike("%[" + org.getId() + "]%");
        orgRepository.deleteAll(subOrgs);
        orgRepository.delete(org);
    }

    public List<OrgNode> queryAllNode() {
        List<Org> list = super.queryAll();
        return generateTree(list);
    }

    public void orgSetPids(Org org) {
        if ( org.getPid() ==null || org.getPid().intValue() == 0) {
            org.setPid(0L);
            org.setPids("[0],");
        } else {
            Long pid = org.getPid();
            Org temp = get(pid);
            String pids = "";
            if(temp!=null){
                pids = temp.getPids();
            }
            org.setPid(pid);
            org.setPids(pids + "[" + pid + "],");
        }
    }

    private List<OrgNode> generateTree(List<Org> list){

        List<OrgNode> nodes = new ArrayList<>(20);
        for(Org org:list){
            OrgNode orgNode = new OrgNode();
            BeanUtils.copyProperties(org,orgNode);
            nodes.add(orgNode);
        }
        for(OrgNode orgNode:nodes){
            for(OrgNode child:nodes){
                if(child.getPid().intValue() == orgNode.getId().intValue()){
                    orgNode.getChildren().add(child);
                }
            }
        }
        List<OrgNode> result = new ArrayList<>(20);
        for(OrgNode node:nodes){
            if(node.getPid().intValue() == 0){
                result.add(node);
            }
        }
        return result;


    }



}

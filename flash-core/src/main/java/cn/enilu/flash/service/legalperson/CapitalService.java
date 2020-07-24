package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.Capital;
import cn.enilu.flash.bean.vo.node.CapitalNode;
import cn.enilu.flash.dao.legalperson.CapitalRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CapitalService extends BaseService<Capital,Long,CapitalRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private CapitalRepository capitalRepository;

    public List<CapitalNode> queryAllNode(String enterpriseCode) {
        List<Capital> list = super.queryAll();
        return generateTree(list, enterpriseCode);
    }

    private List<CapitalNode> generateTree(List<Capital> list, String enterpriseCode){

        List<CapitalNode> nodes = new ArrayList<>(20000);
        for(Capital capital:list){
            CapitalNode capitalNode = new CapitalNode();
            BeanUtils.copyProperties(capital,capitalNode);
            nodes.add(capitalNode);
        }
        for(CapitalNode capitalNode:nodes){
            for(CapitalNode child:nodes){
                if(child.getEnterpriseCode()!=null && capitalNode.getBranchCompanyCode()!=null && capitalNode.getShareholderMold()!=2) {
                    if(child.getEnterpriseCode().equals(capitalNode.getBranchCompanyCode()) ){
                        capitalNode.getChildren().add(child);
                    }
                }

            }
        }
        List<CapitalNode> result = new ArrayList<>(20000);
        for(CapitalNode node:nodes){
            if(node.getEnterpriseCode()!=null) {
                if (node.getEnterpriseCode().equals(enterpriseCode)) {
                    result.add(node);
                }
            }
        }
        return result;

    }

}


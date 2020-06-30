package cn.enilu.flash.service.legalperson;


import cn.enilu.flash.bean.entity.legalperson.InvestCompany;
import cn.enilu.flash.bean.vo.node.InvestCompanyNode;
import cn.enilu.flash.dao.legalperson.InvestCompanyRepository;

import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InvestCompanyService extends BaseService<InvestCompany,Long,InvestCompanyRepository>  {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private InvestCompanyRepository investCompanyRepository;

    public List<InvestCompanyNode> queryAllNode(String enterpriseCode) {
        List<InvestCompany> list = super.queryAll();
        return generateTree(list, enterpriseCode);
    }

    private List<InvestCompanyNode> generateTree(List<InvestCompany> list, String enterpriseCode){

        List<InvestCompanyNode> nodes = new ArrayList<>(20000);
        for(InvestCompany investCompany:list){
            InvestCompanyNode investCompanyNode = new InvestCompanyNode();
            BeanUtils.copyProperties(investCompany,investCompanyNode);
            nodes.add(investCompanyNode);
        }
        for(InvestCompanyNode investCompanyNode:nodes){
            for(InvestCompanyNode child:nodes){
                if(child.getEnterpriseCode().equals(investCompanyNode.getBranchCompanyCode()) ){
                    investCompanyNode.getChildren().add(child);
                }
            }
        }
        List<InvestCompanyNode> result = new ArrayList<>(20000);
        for(InvestCompanyNode node:nodes){
            if(node.getEnterpriseCode().equals(enterpriseCode)){
                result.add(node);
            }
        }
        return result;

    }

}


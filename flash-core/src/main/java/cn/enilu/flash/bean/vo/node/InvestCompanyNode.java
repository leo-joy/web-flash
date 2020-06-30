package cn.enilu.flash.bean.vo.node;

import cn.enilu.flash.bean.entity.legalperson.InvestCompany;

import java.util.ArrayList;
import java.util.List;

/**
 * DeptNode
 *
 * @author enilu
 * @version 2018/9/15 0015
 */
public class InvestCompanyNode extends InvestCompany {

    private List<InvestCompanyNode> children = new ArrayList<>(10000);

    public List<InvestCompanyNode> getChildren() {
        return children;
    }

    public void setChildren(List<InvestCompanyNode> children) {
        this.children = children;
    }
}

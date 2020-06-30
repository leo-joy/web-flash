package cn.enilu.flash.bean.vo.node;

import cn.enilu.flash.bean.entity.legalperson.Capital;

import java.util.ArrayList;
import java.util.List;

/**
 * DeptNode
 *
 * @author enilu
 * @version 2018/9/15 0015
 */
public class CapitalNode extends Capital {

    private List<CapitalNode> children = new ArrayList<>(10000);

    public List<CapitalNode> getChildren() {
        return children;
    }

    public void setChildren(List<CapitalNode> children) {
        this.children = children;
    }
}

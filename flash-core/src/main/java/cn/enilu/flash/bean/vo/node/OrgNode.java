package cn.enilu.flash.bean.vo.node;

import cn.enilu.flash.bean.entity.system.Org;

import java.util.ArrayList;
import java.util.List;

/**
 * OrgNode
 *
 * @author enilu
 * @version 2018/9/15 0015
 */
public class OrgNode extends Org {

    private List<OrgNode> children = new ArrayList<>(10);

    public List<OrgNode> getChildren() {
        return children;
    }

    public void setChildren(List<OrgNode> children) {
        this.children = children;
    }
}

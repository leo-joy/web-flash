package cn.enilu.flash.bean.dictmap;

import cn.enilu.flash.bean.dictmap.base.AbstractDictMap;

/**
 * 部门的映射
 *
 * @author fengshuonan
 * @date 2017-05-06 15:01
 */
public class OrgDict extends AbstractDictMap {

    @Override
    public void init() {
        put("orgId", "部门名称");
        put("id","部门名称");
        put("num", "部门排序");
        put("pid", "上级名称");
        put("simplename", "部门简称");
        put("fullname", "部门全称");
        put("tips", "备注");
    }

    @Override
    protected void initBeWrapped() {
        putFieldWrapperMethodName("orgId", "getOrgName");
        putFieldWrapperMethodName("pid", "getOrgName");
    }
}

package cn.enilu.flash.api.controller.system;

import cn.enilu.flash.api.controller.BaseController;
import cn.enilu.flash.bean.core.BussinessLog;
import cn.enilu.flash.bean.dictmap.OrgDict;
import cn.enilu.flash.bean.entity.system.Org;
import cn.enilu.flash.bean.enumeration.BizExceptionEnum;
import cn.enilu.flash.bean.enumeration.Permission;
import cn.enilu.flash.bean.exception.ApplicationException;
import cn.enilu.flash.bean.vo.front.Rets;
import cn.enilu.flash.bean.vo.node.OrgNode;
import cn.enilu.flash.service.system.OrgService;
import cn.enilu.flash.service.system.LogObjectHolder;
import cn.enilu.flash.utils.BeanUtil;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * OrgContoller
 *
 * @author enilu
 * @version 2018/9/15 0015
 */
@RestController
@RequestMapping("/org")
public class OrgController extends BaseController {
    private Logger logger = LoggerFactory.getLogger(MenuController.class);

    @Autowired
    private OrgService orgService;
    @RequestMapping(value = "/list",method = RequestMethod.GET)
    public Object list(){
        List<OrgNode> list = orgService.queryAllNode();
        return Rets.success(list);
    }

    @RequestMapping(value = "/parentorg",method = RequestMethod.GET)
    public Object parentorg(@RequestParam  Long id){
        Org current = orgService.get(id);
        Org parent = orgService.get(current.getPid());
        return Rets.success(parent);
    }

    @RequestMapping(method = RequestMethod.POST)
    @BussinessLog(value = "编辑部门", key = "simplename", dict = OrgDict.class)
    @RequiresPermissions(value = {Permission.DEPT_EDIT})
    public Object save(@ModelAttribute @Valid Org org){
        if (BeanUtil.isOneEmpty(org, org.getSimplename())) {
            throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
        }
        if(org.getId()!=null){
            Org old = orgService.get(org.getId());
            LogObjectHolder.me().set(old);
            old.setPid(org.getPid());
            old.setSimplename(org.getSimplename());
            old.setFullname(org.getFullname());
            old.setNum(org.getNum());
            old.setTips(org.getTips());
            orgService.orgSetPids(old);
            orgService.update(old);
        }else {
            orgService.orgSetPids(org);
            orgService.insert(org);
        }
        return Rets.success();
    }
    @RequestMapping(method = RequestMethod.DELETE)
    @BussinessLog(value = "删除部门", key = "id", dict = OrgDict.class)
    @RequiresPermissions(value = {Permission.DEPT_DEL})
    public Object remove(@RequestParam  Long id){
        logger.info("id:{}",id);
        if (id == null) {
            throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
        }
        orgService.deleteOrg(id);
        return Rets.success();
    }
}

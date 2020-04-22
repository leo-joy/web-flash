package cn.enilu.flash.api.controller.cms;

import cn.enilu.flash.api.controller.BaseController;
import cn.enilu.flash.bean.constant.factory.PageFactory;
import cn.enilu.flash.bean.entity.system.FileInfo;
import cn.enilu.flash.bean.enumeration.Permission;
import cn.enilu.flash.bean.vo.front.Rets;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.system.FileService;
import cn.enilu.flash.utils.StringUtil;
import cn.enilu.flash.utils.factory.Page;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/fileMgr")
public class FileMgrController extends BaseController {

    @Autowired
    private FileService fileService;

    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @RequiresPermissions(value = {Permission.FILE})
    public Object list(@RequestParam(required = false) String originalFileName
    ) {
        Page<FileInfo> page = new PageFactory<FileInfo>().defaultPage();
        if (StringUtil.isNotEmpty(originalFileName)) {
            page.addFilter(SearchFilter.build("originalFileName", SearchFilter.Operator.LIKE, originalFileName));
        }
        page = fileService.queryPage(page);
        return Rets.success(page);
    }

    @RequestMapping(value = "/enterpriseFiles", method = RequestMethod.GET)
    public Object enterpriseFiles(@RequestParam(required = false) Long mainModuleId
    ) {
        Page<FileInfo> page = new PageFactory<FileInfo>().defaultPage();
        page.addFilter("mainModuleId", SearchFilter.Operator.EQ,Long.valueOf(mainModuleId).longValue());
//        if (StringUtils.isNotEmpty(mainModuleId)) {
//            page.addFilter(SearchFilter.build("mainModuleId", SearchFilter.Operator.LIKE, Long.valueOf(mainModuleId).longValue()));
//        }
        page = fileService.queryPage(page);
        return Rets.success(page);
    }

    @RequestMapping(value = "/listIds", method = RequestMethod.GET)
    public Object listIds(@RequestParam(required = false) String ids
    ) {
        Page<FileInfo> page = new PageFactory<FileInfo>().defaultPage();
        List<String> list = new ArrayList<>();
        if (StringUtil.isNotEmpty(ids)) {
            String[] strArray = ids.split(" ");
            for (int j = 0; j < strArray.length; j++) {
                list.add(strArray[j]);
            }
        }else {
            list.add(ids);
        }

        page.addFilter(SearchFilter.build("id", SearchFilter.Operator.IN, list));

        page = fileService.queryPage(page);
        return Rets.success(page);
    }
}

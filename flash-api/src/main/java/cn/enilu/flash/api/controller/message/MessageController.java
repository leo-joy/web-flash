package cn.enilu.flash.api.controller.message;

import cn.enilu.flash.bean.constant.factory.PageFactory;
import cn.enilu.flash.bean.core.BussinessLog;
import cn.enilu.flash.bean.entity.message.Message;
import cn.enilu.flash.bean.enumeration.Permission;
import cn.enilu.flash.bean.vo.front.Rets;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.message.MessageService;
import cn.enilu.flash.utils.DateUtil;
import cn.enilu.flash.utils.factory.Page;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/message")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @RequiresPermissions(value = {Permission.MSG})
    public Object list(  @RequestParam(required = false) String startDate,
                         @RequestParam(required = false) String endDate) {
        Page<Message> page = new PageFactory<Message>().defaultPage();
        page.addFilter("createTime", SearchFilter.Operator.GTE, DateUtil.parse(startDate,"yyyyMMddHHmmss"));
        page.addFilter("createTime", SearchFilter.Operator.LTE, DateUtil.parse(endDate,"yyyyMMddHHmmss"));
        page = messageService.queryPage(page);
        page.setRecords(page.getRecords());
        return Rets.success(page);
    }

    @RequestMapping(method = RequestMethod.DELETE)
    @BussinessLog(value = "清空所有历史消息")
    @RequiresPermissions(value = {Permission.MSG_CLEAR})
    public Object clear() {
        messageService.clear();
        return Rets.success();
    }

    @RequestMapping(value = "/sendEmail", method = RequestMethod.POST)
    public Object sendEmail(@RequestParam(required = false) String tplCode,
                            @RequestParam(required = false) String from,
                            @RequestParam(required = false) String to,
                            @RequestParam(required = false) String cc,
                            @RequestParam(required = false) String title,
                            @RequestParam(required = false) String content) {

        // tplCode,from,to,cc,title,content
        //messageService.
        messageService.sendSimpleEmail(tplCode,from,to,cc,title,content);
        //messageService.sendSms("REGISTER_CODE", "15365067296", "2322");
        return Rets.success();
    }
}
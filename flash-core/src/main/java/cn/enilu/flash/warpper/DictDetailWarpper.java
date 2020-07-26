package cn.enilu.flash.warpper;

import cn.enilu.flash.bean.entity.system.Dict;
import cn.enilu.flash.service.system.impl.ConstantFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 字典列表的包装
 *
 * @author zhanglei
 * @date 2020年7月24日 18:10:31
 */
public class DictDetailWarpper extends BaseControllerWarpper {

    public DictDetailWarpper(Object list) {
        super(list);
    }

    @Override
    public void warpTheMap(Map<String, Object> map) {
        List<Object> detail = new ArrayList<>();
        Long id = (Long) map.get("id");
        List<Dict> dicts = ConstantFactory.me().findInDict(id);
        if(dicts != null){
            for (Dict dict : dicts) {
                Map<String, String> result = new HashMap<>(1);
                result.put("key", dict.getNum());
                result.put("name", dict.getName());
                detail.add(result);
            }
            map.put("detail", detail);
        }
    }

}

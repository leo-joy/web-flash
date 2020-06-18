package cn.enilu.flash.core.factory;

import cn.enilu.flash.bean.dto.UserDto;
import cn.enilu.flash.bean.entity.system.User;
import org.springframework.beans.BeanUtils;

/**
 * 用户创建工厂
 *
 * @author fengshuonan
 * @date 2017-05-05 22:43
 */
public class UserFactory {

    public static User createUser(UserDto userDto, User user){
        if(userDto == null){
            return null;
        }else{
            BeanUtils.copyProperties(userDto,user);
            return user;
        }
    }
    public static User updateUser(UserDto userDto,User user){
        if(userDto == null){
            return null;
        }else{
            user.setName(userDto.getName());
            user.setDeptid(userDto.getDeptid());
            user.setSex(userDto.getSex());
            user.setPhone(userDto.getPhone());
            user.setEmail(userDto.getEmail());
            user.setBirthday(userDto.getBirthday());

            user.setAcademic(userDto.getAcademic());
            user.setSpecialty(userDto.getSpecialty());
            user.setPost(userDto.getPost());
            user.setDuty(userDto.getDuty());
            user.setExperience(userDto.getExperience());
            user.setType(userDto.getType());

            user.setWorkNumber(userDto.getWorkNumber());
            user.setEnglishSurnames(userDto.getEnglishSurnames());
            user.setEnglishName(userDto.getEnglishName());
            user.setChineseNameBefore(userDto.getChineseNameBefore());
            user.setEnglishNameBefore(userDto.getEnglishNameBefore());
            user.setChineseNameAlias(userDto.getChineseNameAlias());
            user.setEnglishNameAlias(userDto.getEnglishNameAlias());
            user.setAddress(userDto.getAddress());
            user.setRegion(userDto.getRegion());
            user.setIdentityCardChinese(userDto.getIdentityCardChinese());
            user.setIdentityCardHk(userDto.getIdentityCardHk());
            user.setPassportNo(userDto.getPassportNo());
            user.setPassportNational(userDto.getPassportNational());

            user.setJobStnd(userDto.getJobStnd());
            user.setJobName(userDto.getJobName());
            user.setPostStat(userDto.getPostStat());
            user.setSexName(userDto.getSexName());
            user.setPkCorp(userDto.getPkCorp());
            user.setPkDeptdoc(userDto.getPkDeptdoc());
            
            if(userDto.getStatus()!=null){
                user.setStatus(userDto.getStatus());
            }
            return user;


        }
    }
}

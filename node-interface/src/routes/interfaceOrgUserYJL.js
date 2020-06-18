/**
 * Module name: 组织机构接口管理模块
 * Module description: 组织机构接口管理的接口
 * interface:
 * 1、获取组织机构列表  (method:get, url:orginterfacemysql/api)
 * 2、获取组织机构树     (method:get, url:orginterfacemysql/api/tree)
 * 3、导入组织机构的excel     (method:get, url:orginterfacemysql/import)
 * 4、导出组织机构的excel     (method:get, url:orginterfacemysql/export)
 * Author: Zhanglei
 * Date: 2017-12-12
 */
var express = require("express");
var router = express.Router();

var soap = require("soap");
var http = require("http");

//文件操作库
const fs = require("fs");
const multipart = require("connect-multiparty");
const xlsx = require("node-xlsx"); //excel文件操作

//mysql 同步操作依赖包
var { wrap: async } = require("co");
var wrapper = require("co-mysql");
var mysqlClient = require("../config/mysqlClient.js");

//id生产器
var uuid = require("node-uuid");

//日志
var winston = require("winston");

//公共函数库
const customLib = require("../utils/customLib");

const multipartMiddleware = multipart();

/**
 * method: GET
 * description: 获取组织机构tree
 * @date     2017-12-12
 * @author   zhanglei
 */
router.get("/api/tree", async(function* (req, res, next) {
    try {
      //代码区
      const _res = res;
      //const treeNode = "ed249a20";
      const treeNode = '0';
      //更新数据库数据
      if (req.query.reset) {
        let tempOrgsTree = {};
        let orgsTree = { data: [] };  // 没有导入的组织机构
        let usersData = { data: [] }; // 没有导入的用户
        let todoUpdateUsersData = { data: [] }; // 将要被更新的用户

        //函数：用于从webservice获取组织机构数据
        var getOrganizationData = async(function* () {
          try {
            //创建数据库链接
            let mysqlConn = mysqlClient();
            //包装成co模式
            let mysqlConnCo = wrapper(mysqlConn);
            //从数据库获得数据
            let sqlAllData =
              "SELECT * from t_sys_org order by create_time asc";
            //执行搜索，将结果返回给rows
            let sqldatas = yield mysqlConnCo.query(sqlAllData);
            //关闭数据库链接
            mysqlConn.end();
            //获取公司数据与部门数据的接口
            //				var urlOne = 'http://10.1.19.154:8099/uapws/service/IDeptAllServer?wsdl';
            //				var url = 'http://10.1.19.154:8099/uapws/service/CorpAllServer?wsdl';
            var urlOne ="http://10.1.19.61:80/uapws/service/nc.yjl.da.deptall.IDeptAll?wsdl";
            var url = "http://10.1.19.61:80/uapws/service/CorpAllServer?wsdl";
            var args = {'string':'','string1':'','string2':'0fae898c074343729843ac2ce64d3931'};
            var wsdlOptions = {};
            let corpData = [];
            let deptData = [];

            soap.createClient(url, wsdlOptions, function (err, client) {
              if (err !== null) {
                console.log(err);
              }
              //获得数据
              client.getpsndocall(args, function (err, result) {
                if (err !== null) {
                  console.log(err);
                }
                //console.log(result)
                if(!result.return.dates) {
                  return false
                }
                corpData = result["return"]["dates"];
                console.log("从接口获取的公司corp数量：" + result["return"]['count']);
                soap.createClient(urlOne, wsdlOptions, function (
                  err,
                  clientOne
                ) {
                  if (err !== null) {
                    console.log(err);
                  }
                  //获取数据
                  clientOne.getdeptall({'string':'','string1':'0fae898c074343729843ac2ce64d3931'}, function (err, resultOne) {
                    if (err !== null) {
                      console.log(err);
                    }
                    if(!resultOne.return.dates) {
                      return false
                    }

                    //数据有重复，清除重复数据
                    corpData = customLib.uniqeByKeys(corpData, ["pk_corp"]);
                    console.log("去重之后的公司corp数量：" + corpData.length);

                    for(let z=0; z<5; z++) {
                      console.log(corpData[z])
                    }

                    deptData = resultOne["return"]["dates"];
                    
                    let existChild = deptData;
                    console.log("从接口获取的部门dept数量：" + resultOne["return"]["count"]);

                    //数据有重复，清除重复数据
                    deptData = customLib.uniqeByKeys(existChild, [
                      "pk_deptdoc",
                    ]);
                    console.log("去重之后的部门dept数量：" + deptData.length);
                    for(let z=0; z<5; z++) {
                      console.log(deptData[z])
                    }
                    //将部门的父节点添加上去
                    let newDeptData = []
                    deptData.map((item) => {
                      for (let i = 0; i < corpData.length; i++) {
                        let orgcode = corpData[i]["pk_corp"];
                        if (orgcode == item.pk_corp) {
                          item['unitcode2'] = corpData[i]["unitcode"]
                          item['unitname2'] = corpData[i]["unitname"]
                          item['unitcode'] = item.deptcode;
                          item['unitname'] = item.deptname;
                          newDeptData.push(item)
                        }
                      }
                    });


                    console.log("去重之后的部门dept数量：" + deptData.length);
                    tempOrgsTree = newDeptData;
                    
                    let corpDeptdata = corpData.concat(newDeptData);
                    sqldatas.map((item) => {
                      for (let i = 0; i < corpDeptdata.length; i++) {
                        let orgcode = corpDeptdata[i]["pk_deptdoc"] || corpDeptdata[i]["pk_corp"];
                        if (orgcode == item.pk_corp) {
                          corpDeptdata.splice(i, 1);
                        }
                      }
                    });
                    orgsTree.data = corpDeptdata;
                    console.log("去除已导入剩余公司部门corpDept数量：" + corpDeptdata.length);
                    // for(let z=1185; z<1195; z++) {
                    //   console.log(corpDeptdata[z])
                    // }
                    return;

                      // if (corpDeptdata.length == 0) {
                      //   _res.send({
                      //     state: true
                      //   })
                      // };
                  });
                });
              });
            });
          } catch (err) {
            //保存日志信息
            winston.error(err);
            //返回错误信息到客户端
            customLib.errHandle(err, res);
          }
        });

        //函数：用于从webservice获取用户数据
        var getUserData = async(function* (res) {
          try {
            //创建数据库链接
            let mysqlConn = mysqlClient();
            //包装成co模式
            let mysqlConnCo = wrapper(mysqlConn);
            //从数据库获得数据
            let sqlAllData =
              "SELECT * from t_sys_user order by create_time asc";
            //执行搜索，将结果返回给rows
            let sqldatas = yield mysqlConnCo.query(sqlAllData);
            //关闭数据库链接
            mysqlConn.end();
            //获取公司数据与部门数据的接口
            //				var url = 'http://10.1.19.154:8099/uapws/service/IPsndocAllServer?wsdl';
            var url ="http://10.1.19.61:80/uapws/service/IPsndocAllServer?wsdl";
            var args = {};
            var wsdlOptions = {};
            let userData = [];

            soap.createClient(url, wsdlOptions, function (err, client) {
              if (err !== null) {
                console.log(err);
              }
              //获取数据
              client.getpsndocall(args, function (err, result) {
                if (err !== null) {
                  console.log(err);
                }

                userData = result["return"]["dates"];
                let existChild = userData;
                console.log("从接口获取的user数量：" + userData.length);

                //数据有重复，清除重复数据
                userData = customLib.uniqeByKeys(existChild, ["pk_psnbasdoc"]);

                console.log("去重之后的user数量：" + userData.length);
                console.log("数据库中user数量：" + sqldatas.length);

                sqldatas.map((item) => {
                  for (let i = 0; i < userData.length; i++) {
                    let usercode = userData[i]["psncode"];
                    if (usercode == item['work_number']) {
                      userData.splice(i, 1);
                    }
                  }
                });
                usersData.data = userData;
                console.log("去除已导入剩余user数量：" + userData.length);
                // for(let z=0; z<10; z++) {
                //   console.log(usersData.data[z])
                // }
                return;
                //									if (userData.length == 0) {
                //										_res.send({
                //											state: true
                //										})
                //									};
              });
            });
          } catch (err) {
            //保存日志信息
            winston.error(err);
            //返回错误信息到客户端
            customLib.errHandle(err, res);
          }
        });

        //函数：用于从webservice获取用户数据
        var getUpdateUserData = async(function* (res) {
          try {
            //创建数据库链接
            let mysqlConn = mysqlClient();
            //包装成co模式
            let mysqlConnCo = wrapper(mysqlConn);
            //从数据库获得数据
            let sqlAllData =
              "SELECT * from t_sys_user order by create_time asc";
            //执行搜索，将结果返回给rows
            let sqldatas = yield mysqlConnCo.query(sqlAllData);
            //关闭数据库链接
            mysqlConn.end();
            //获取公司数据与部门数据的接口
            //				var url = 'http://10.1.19.154:8099/uapws/service/IPsndocAllServer?wsdl';
            var url ="http://10.1.19.61:80/uapws/service/IPsndocAllServer?wsdl";
            var args = {};
            var wsdlOptions = {};
            let userData = [];

            soap.createClient(url, wsdlOptions, function (err, client) {
              if (err !== null) {
                console.log(err);
              }
              //获取数据
              client.getpsndocall(args, function (err, result) {
                if (err !== null) {
                  console.log(err);
                }

                userData = result["return"]["dates"];
                let existChild = userData;
                console.log("从接口获取的user数量：" + userData.length);
                
                //数据有重复，清除重复数据
                userData = customLib.uniqeByKeys(existChild, ["pk_psnbasdoc"]);

                console.log("去重之后的user数量：" + userData.length);
                console.log("数据库中user数量：" + sqldatas.length);
                let newUserData = [];
                sqldatas.map((item, j) => {
                  for (let i = 0; i < userData.length; i++) {
                    //let usercode = userData[i]["psncode"].trim();
                    if(item['work_number']){
                      if (userData[i]["psncode"] == item['work_number']) {
                        newUserData.push(userData[i])
                      }
                    }
                  }
                });
                console.log("将要更新user数量：" + newUserData.length);

                todoUpdateUsersData.data = newUserData;
                return;
                //									if (userData.length == 0) {
                //										_res.send({
                //											state: true
                //										})
                //									};
              });
            });
          } catch (err) {
            //保存日志信息
            winston.error(err);
            //返回错误信息到客户端
            customLib.errHandle(err, res);
          }
        });

        

        //1、获取组织机构数据
        
        // yield getOrganizationData(res);

        yield getUpdateUserData(res)
        //yield getUserData(res);



        

        //2、拼装执行组织机构sql语句
        var saveOrgs = async(function* (arr, num, res) {
          try {
            let tempSql = "";
            console.log("saveOrgs中arr-org数量：" + arr.length);
            arr.map(function (item, i) {
              let _ID = i+num
              let fathercrop = item["fathercorp"];
              if (!fathercrop) {
                fathercrop = treeNode;
              }
              fathercrop = item["pk_deptdoc"] ? item["pk_corp"] : fathercrop;

              tempSql = tempSql + "(" + 
                "'" +item["unitcode"] +"'," +
                "'" +item["unitcode2"] +"'," +
                "'" +item["unitcode2"] +"'," +
                "'" +item["unitname"] +"'," +
                "'" +(item["unitname2"]+"-"+item["unitname"]) +"'," +
                "'" + fathercrop +"'," +
                "'" +item["isseal"] +"'," +
                "'" +item["ts"] +"'),";
            });
            //将undefined值替换为''
            tempSql = tempSql
              .substr(0, tempSql.length - 1)
              .replace(/undefined/g, "");

            if (tempSql != "") {
              //创建数据库链接
              let mysqlConn = mysqlClient();
              //包装成co模式
              let mysqlConnCo = wrapper(mysqlConn);
              let excelSql =
                "INSERT INTO t_sys_org ( mid, pid, pids, simplename, fullname, pk_corp, isseal, ts) VALUES " +
                tempSql;
              //执行sql语句,批量插入数据
              yield mysqlConnCo.query(excelSql);
              //						res.send({
              //							state: true
              //						});
              //关闭数据库链接
              mysqlConn.end();
            } else {
              console.log("导入失败，可能是数据问题。");
            }
          } catch (err) {
            //保存日志信息
            winston.error(err);
            //返回错误信息到客户端
            customLib.errHandle(err, res);
          }
        });

        var updateUsers = async(function* (arr, res) {
          try {
            console.log("updateUsers中arr-user数量：" + arr.length);
            let psncodeArr = []; // 工号数组
            let jobStndStr = ''; // 职位类型
            let jobNameStr = ''; // 职位
            let postStatStr = ''; //在职状态
            let sexNameStr = '';  //中文性别
            let pkCorpStr = '';   //公司编号
            let pkDeptdocStr = '';   //部门编号
            let phoneStr = ''; // 电话
              
            arr.map(function (item) {
              psncodeArr.push("'"+item.psncode+"'");
              jobStndStr = jobStndStr + "WHEN '"+item.psncode+"' THEN '"+item.jobstnd+"' ";
              jobNameStr = jobNameStr + "WHEN '"+item.psncode+"' THEN '"+item.jobname+"' ";
              postStatStr = postStatStr + "WHEN '"+item.psncode+"' THEN '"+item.poststat+"' ";
              sexNameStr = sexNameStr + "WHEN '"+item.psncode+"' THEN '"+item.sex+"' ";
              pkCorpStr = pkCorpStr + "WHEN '"+item.psncode+"' THEN '"+item.pk_corp+"' ";
              pkDeptdocStr = pkDeptdocStr + "WHEN '"+item.psncode+"' THEN '"+item.pk_deptdoc+"' ";
              phoneStr = phoneStr + "WHEN '"+item.psncode+"' THEN '"+item.mobile+"' ";
            });
            //将undefined值替换为''
            jobStndStr = jobStndStr.substr(0, jobStndStr.length - 1).replace(/undefined/g, "");
            jobNameStr = jobNameStr.substr(0, jobNameStr.length - 1).replace(/undefined/g, "");
            postStatStr = postStatStr.substr(0, postStatStr.length - 1).replace(/undefined/g, "");
            sexNameStr = sexNameStr.substr(0, sexNameStr.length - 1).replace(/undefined/g, "");
            pkCorpStr = pkCorpStr.substr(0, pkCorpStr.length - 1).replace(/undefined/g, "");
            pkDeptdocStr = pkDeptdocStr.substr(0, pkDeptdocStr.length - 1).replace(/undefined/g, "");
            phoneStr = phoneStr.substr(0, phoneStr.length - 1).replace(/undefined/g, "");

            jobStndSql = "job_stnd = Case work_number " + jobStndStr + " END, "
            jobNameSql = "job_name = Case work_number " + jobNameStr + " END, "
            postStatSql = "post_stat = Case work_number " + postStatStr + " END, "
            sexNameSql = "sex_name = Case work_number " + sexNameStr + " END, "
            pkCorpSql = "pk_corp = Case work_number " + pkCorpStr + " END, "
            pkDeptdocSql = "pk_deptdoc = Case work_number " + pkDeptdocStr + " END, "
            phoneSql = "phone = Case work_number " + phoneStr + " END "
            
            if (jobNameSql != "") {
              //创建数据库链接
              let mysqlConn = mysqlClient();
              //包装成co模式
              let mysqlConnCo = wrapper(mysqlConn);
              //UPDATE Person SET Address = 'Zhongshan 23', City = 'Nanjing' WHERE LastName = 'Wilson';

              let excelSql = "UPDATE t_sys_user SET " + jobStndSql + jobNameSql +postStatSql+sexNameSql+pkCorpSql+pkDeptdocSql+phoneSql+ " WHERE work_number IN ("+psncodeArr.join(', ')+")";
              console.log('excelSql:')
              //console.log(excelSql)
              //执行sql语句,批量插入数据
              yield mysqlConnCo.query(excelSql);
              //						res.send({
              //							state: true
              //						});
              //关闭数据库链接
              mysqlConn.end();
            } else {
              console.log("导入失败，可能是数据问题。");
            }
          } catch (err) {
            //保存日志信息
            winston.error(err);
            //返回错误信息到客户端
            customLib.errHandle(err, res);
          }
        });

        var saveUsers = async(function* (arr, res) {
          try {
            let tempSql = "";
            console.log("saveUsers中arr-user数量：" + arr.length);
            arr.map(function (item) {
              let _loginName = item["email"] ? item["email"].split("@")[0] : ""; //登录名
              if (!_loginName) {
                _loginName = item["psncode"] ? item["psncode"] : "";
              }
              let _sex = item["sex"] == "女" ? 2 : 1; //性别
              let _status = item["poststat"] == "在职" ? 1 : 2;  //在职位状态
              let _orgName = ""; //部门
              for (let i = 0; i < tempOrgsTree.length; i++) {
                if (tempOrgsTree[i].pk_deptdoc == item["pk_deptdoc"]) {
                  _orgName = tempOrgsTree[i].deptname;
                }
              }

              //if (_status == 1 && _loginName) {
                tempSql = tempSql +"(" +
                "'" + _loginName + "'," +//account, 
                "'8848229a8ac405d227ff0014e26690bf'," +//password, 
                "'ssycy'," +//salt, 
                "'" +item["psnname"] +"'," +//name, 
                "'" + _sex + "'," +//sex, 
                "'" +item["email"] +"'," +//email, 
                "'" +item["mobile"] +"'," +//phone, 
                "'" + _status + "'," +//status,
                "'" +item["psncode"] +"'," +//work_number.
                "'" +item["jobstnd"] +"'," +//job_stnd,
                "'" +item["jobname"] +"'," +//job_name,
                "'" +item["poststat"] +"'," +//post_stat,
                "'" +item["sex"] +"'," +//sex_name,
                "'" +item["pk_corp"] +"'," +//pk_corp,
                "'" +item["pk_deptdoc"] +"'),";//pk_deptdoc 
              //} else {
                //console.log('item--email----------')
                //console.log(item)
              //}
            });
            //将undefined值替换为''
            tempSql = tempSql.substr(0, tempSql.length - 1).replace(/undefined/g, "");
            if (tempSql != "") {
              //创建数据库链接
              let mysqlConn = mysqlClient();
              //包装成co模式
              let mysqlConnCo = wrapper(mysqlConn);
              let excelSql =
                "INSERT INTO t_sys_user (account, password, salt, name, sex, email, phone, status,work_number,job_stnd,job_name,post_stat,sex_name,pk_corp,pk_deptdoc) VALUES " +
                tempSql;
              //执行sql语句,批量插入数据
              yield mysqlConnCo.query(excelSql);
              //						res.send({
              //							state: true
              //						});
              //关闭数据库链接
              mysqlConn.end();
            } else {
              console.log("导入失败，可能是数据问题。");
            }
          } catch (err) {
            //保存日志信息
            winston.error(err);
            //返回错误信息到客户端
            customLib.errHandle(err, res);
          }
        });

        //3、防止存储的字符串过长，分成100个一组进行存储
        

        var makeOrgArray = function(arr1, arr2, res) {
        	arr2 = arr1.slice(0, 100);
        	arr1.splice(0, 100);
        	saveOrgs(arr2, res)
        }

        var makeUpdateUserArray = function(arr1, arr2, res) {
        	arr2 = arr1.slice(0, 100);
        	arr1.splice(0, 100);
        	updateUsers(arr2, res)
        }

        var makeUserArray = function(arr1, arr2, res) {
        	arr2 = arr1.slice(0, 100);
        	arr1.splice(0, 100);
        	saveUsers(arr2, res)
        }

        

        //4、监听是否从webservice获得数据
        // Object.defineProperty(orgsTree, "data", {
        //   set: function (newValue) {
        //     let length = newValue.length;
        //     let num = Math.ceil(length / 100);
        //     let arr2 = [];
        //     for (let i = 0; i < num; i++) {
        //       makeOrgArray(newValue, arr2);
        //       if (i + 1 == num) {
        //         res.send({ state: true });
        //       }
        //     }
        //   },
        //   get: function () {
        //     console.log("你取我的值");
        //   },
        // });

        Object.defineProperty(todoUpdateUsersData, "data", {
          set: function (newValue) {
            let length = newValue.length;
            console.log("updateUser新值的长度:" + length);
            let num = Math.ceil(length / 100);
            let arr2 = [];
            console.log("updateUser要执行sql总次数:" + num);
            for (let i = 0; i < num; i++) {
              console.log("updateUser执行sql次数:" + i);
              // if(i==0){
              //   makeUpdateUserArray(newValue, arr2);
              // }
              makeUpdateUserArray(newValue, arr2);
              if (i + 1 == num) {
                res.send({ state: true });
              }
            }
          },
          get: function () {
            console.log("你取我的值");
          },
        });

        // Object.defineProperty(usersData, "data", {
        //   set: function (newValue) {
        //     let length = newValue.length;
        //     console.log("saveNewUser新值的长度:" + length);
        //     let num = Math.ceil(length / 100);
        //     let arr2 = [];
        //     console.log("saveNewUser要执行sql总次数:" + num);
        //     for (let i = 0; i < num; i++) {
        //       console.log("saveNewUser执行sql次数:" + i);
        //       makeUserArray(newValue, arr2);
        //       if (i + 1 == num) {
        //         res.send({ state: true });
        //       }
        //     }
        //   },
        //   get: function () {
        //     console.log("你取我的值");
        //   },
        // });
      } else {
        //创建数据库链接
        let mysqlConn = mysqlClient();
        //包装成co模式
        let mysqlConnCo = wrapper(mysqlConn);

        //从数据库获得数据并组装成树
        let sqlData = "SELECT * from t_sys_org order by create_time asc";
        //执行搜索，将结果返回给rows
        let rows = yield mysqlConnCo.query(sqlData);

        //关闭数据库链接
        mysqlConn.end();

        

        if (rows.length) {
          let obj = {};
          //obj.data = getTree(rows, treeNode);
          obj.state = true;
          res.send(obj);
        }
      }
    } catch (err) {
      //保存日志信息
      winston.error(err);
      //返回错误信息到客户端
      customLib.errHandle(err, res);
    }
  })
);

/**
 * method: POST
 * description: 导入组织机构的xml
 * @date     2017-05-07
 * @author   zhanglei
 */
router.post(
  "/import",
  multipartMiddleware,
  async(function* (req, res, next) {
    try {
      //代码区
      res.send({
        state: true,
      });
    } catch (err) {
      //保存日志信息
      winston.error(err);
      //返回错误信息到客户端
      customLib.errHandle(err, res);
    }
  })
);

/**
 * method: POST
 * description: 导出组织机构的excel
 * @date     2017-05-07
 * @author   zhanglei
 */

router.get(
  "/export",
  multipartMiddleware,
  async(function* (req, res) {
    try {
      //代码区
      //创建数据库链接
      let mysqlConn = mysqlClient();
      //包装成co模式
      let mysqlConnCo = wrapper(mysqlConn);
      //导出数据
      let data = [
        [
          "ID",
          "上级公司ID",
          "公司主键",
          "公司编码",
          "公司名称",
          "公司层级",
          "是否封存",
          "最后更新时间",
          "创建时间",
        ],
      ];
      let sqlData = "select * from t_sys_org";
      //执行sql语句
      let rows = yield mysqlConnCo.query(sqlData);
      //关闭数据库链接
      mysqlConn.end();

      rows.map(function (item) {
        let arr = [];
        arr.push(item._ID);
        arr.push(item.fathercorp);
        arr.push(item.pk_corp);
        arr.push(item.unitcode);
        arr.push(item.unitname);
        arr.push(item.corplevel);
        arr.push(item.isseal);
        arr.push(item.create_time);

        data.push(arr);
      });

      let buffer = xlsx.build([
        {
          name: "组织机构公司列表",
          data: data,
        },
      ]); // returns a buffer
      res
        .type("application/vnd.openxmlformats")
        .set("Content-Disposition", "attachment; filename=orgTable.xlsx");
      res.end(buffer, "binary");
    } catch (err) {
      //保存日志信息
      winston.error(err);
      //返回错误信息到客户端
      customLib.errHandle(err, res);
    }
  })
);

module.exports = router;

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
 * name: 组织机构列表
 *
 * description:获取组织机构列表
 *
 * @param    {number}  pageSize    分页数量
 * @param    {number}  currPage    当前页
 * @returns  object
 *
 * @date     2017-12-12
 * @author   zhanglei
 */

const getOrgs = async(function* (
  req,
  res,
  next,
  pageSize,
  currPage,
  oldCode,
  oldParentCode,
  newParentCode
) {
  try {
    //创建数据库链接
    let mysqlConn = mysqlClient();
    //包装成co模式
    let mysqlConnCo = wrapper(mysqlConn);

    //解构url中的数据
    let { field, keyword, ORG_CODE } = req.query;
    field = field ? field : "";
    if (req.query.token) {
      ORG_CODE = req.query.ORG_CODE;
    } else {
      ORG_CODE = req.body.ORG_PARENT_CODE;
    }
    keyword = keyword ? keyword : "";
    ORG_CODE = ORG_CODE ? ORG_CODE : "";
    //分页计算
    let _pageSize = !!pageSize ? pageSize * 1 : 10;
    let _currPage = !!currPage ? currPage * 1 : 1;
    let startNum = (_currPage - 1) * _pageSize;
    let endNum = _pageSize;

    let sonSql = "";
    //初始化搜索语句
    let sqlData =
      "select * from t_interface_dept limit " + startNum + "," + endNum;
    let sqlTotal = "select count(_ID) from t_interface_dept";

    //点击右侧树
    if (ORG_CODE) {
      sqlData =
        "select * from t_interface_dept where ORG_PARENT_CODE like " +
        "'%" +
        ORG_CODE +
        "%' order by create_time asc limit " +
        startNum +
        "," +
        endNum;
      sqlTotal =
        "select count(_ID) from t_interface_dept where ORG_PARENT_CODE like " +
        "'%" +
        ORG_CODE +
        "%'";
    }

    //搜索过滤
    if (field && keyword) {
      if (ORG_CODE) {
        sqlData =
          "select * from t_interface_dept where " +
          field +
          " like " +
          "'%" +
          keyword +
          "%' and ORG_CODE like " +
          "'%" +
          ORG_CODE +
          "%' limit " +
          startNum +
          "," +
          endNum;

        sqlTotal =
          "select count(_ID) from t_interface_dept where " +
          field +
          " like " +
          "'%" +
          keyword +
          "%' and ORG_CODE like " +
          "'%" +
          ORG_CODE +
          "%'";
      } else {
        sqlData =
          "select * from t_interface_dept where " +
          field +
          " like " +
          "'%" +
          keyword +
          "%' limit " +
          startNum +
          "," +
          endNum;

        sqlTotal =
          "select count(_ID) from t_interface_dept where " +
          field +
          " like " +
          "'%" +
          keyword +
          "%'";
      }
    }

    //执行搜索，将结果返回给rows
    let rows = yield mysqlConnCo.query(sqlData);
    let rowsTotal = yield mysqlConnCo.query(sqlTotal);

    //关闭数据库链接
    mysqlConn.end();
    //如果返回结果为空，抛出异常
    if (!rows) {
      throw new Error("rows is null");
    }

    //创建返回对象
    let obj = {};
    obj.data = rows;
    if (oldCode && oldParentCode && newParentCode) {
      obj.oldCode = oldCode;
      obj.oldParentCode = oldParentCode;
      obj.newParentCode = newParentCode;
    }
    obj.page = {
      current: _currPage,
      total: rowsTotal[0]["count(_ID)"],
    };
    obj.state = true;
    res.send(obj);
  } catch (err) {
    //保存日志信息
    winston.error(err);
    //返回错误信息到客户端
    customLib.errHandle(err, res);
  }
});

/* cors listing. */
router.options("/system/orginterfacemysql/api");

/* GET orgs listing. */
router.get("/api", function (req, res, next) {
  //记录用户操作日志
  let pageSize = req.query.pageSize || 10;
  let page = req.query.page || 1;
  getOrgs(req, res, next, pageSize, page);
});

/**
 * method: GET
 * description: 获取组织机构tree
 * @date     2017-12-12
 * @author   zhanglei
 */
router.get(
  "/api/tree",
  async(function* (req, res, next) {
    try {
      //代码区
      const _res = res;
      const treeNode = "ed249a20";
      //const treeNode = '0';
      //更新数据库数据
      if (req.query.reset) {
        let tempOrgsTree = {};
        let orgsTree = { data: [] };
        let usersData = { data: [] };

        //函数：用于从webservice获取组织机构数据
        var getOrganizationData = async(function* () {
          try {
            //创建数据库链接
            let mysqlConn = mysqlClient();
            //包装成co模式
            let mysqlConnCo = wrapper(mysqlConn);
            //从数据库获得数据
            let sqlAllData =
              "SELECT * from t_interface_dept order by create_time asc";
            //执行搜索，将结果返回给rows
            let sqldatas = yield mysqlConnCo.query(sqlAllData);
            //关闭数据库链接
            mysqlConn.end();
            //获取公司数据与部门数据的接口
            //				var urlOne = 'http://10.1.19.154:8099/uapws/service/IDeptAllServer?wsdl';
            //				var url = 'http://10.1.19.154:8099/uapws/service/CorpAllServer?wsdl';
            var urlOne =
              "http://10.1.19.61:80/uapws/service/nc.yjl.da.deptall.IDeptAll?wsdl";
            var url = "http://10.1.19.61:80/uapws/service/CorpAllServer?wsdl";
            var args = {};
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
                console.log(result);
                corpData = result["return"]["dates"];
                console.log("从接口获取的公司corp数量：" + corpData.length);

                soap.createClient(urlOne, wsdlOptions, function (
                  err,
                  clientOne
                ) {
                  if (err !== null) {
                    console.log(err);
                  }
                  //获取数据
                  clientOne.getdeptall(args, function (err, resultOne) {
                    if (err !== null) {
                      console.log(err);
                    }

                    deptData = resultOne["return"]["dates"];
                    let existChild = deptData;
                    console.log("从接口获取的部门dept数量：" + deptData.length);

                    //数据有重复，清除重复数据
                    deptData = customLib.uniqeByKeys(existChild, [
                      "pk_deptdoc",
                    ]);
                    console.log("去重之后的部门dept数量：" + deptData.length);
                    tempOrgsTree = deptData;
                    //数据有重复，清除重复数据
                    corpData = customLib.uniqeByKeys(corpData, ["pk_corp"]);
                    console.log("去重之后的公司corp数量：" + corpData.length);
                    let corpDeptdata = corpData.concat(deptData);
                    sqldatas.map((item) => {
                      for (let i = 0; i < corpDeptdata.length; i++) {
                        let orgcode =
                          corpDeptdata[i]["pk_deptdoc"] ||
                          corpDeptdata[i]["pk_corp"];
                        if (orgcode == item.ORG_CODE) {
                          corpDeptdata.splice(i, 1);
                        }
                      }
                    });
                    orgsTree.data = corpDeptdata;
                    console.log(
                      "去除已导入剩余公司部门corpDept数量：" +
                        corpDeptdata.length
                    );
                    return;

                    //								if (corpDeptdata.length == 0) {
                    //									_res.send({
                    //										state: true
                    //									})
                    //								};
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
              "SELECT * from t_interface_user order by create_time asc";
            //执行搜索，将结果返回给rows
            let sqldatas = yield mysqlConnCo.query(sqlAllData);
            //关闭数据库链接
            mysqlConn.end();
            //获取公司数据与部门数据的接口
            //				var url = 'http://10.1.19.154:8099/uapws/service/IPsndocAllServer?wsdl';
            var url =
              "http://10.1.19.61:80/uapws/service/IPsndocAllServer?wsdl";
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

                sqldatas.map((item) => {
                  for (let i = 0; i < userData.length; i++) {
                    let usercode = userData[i]["pk_psnbasdoc"];
                    if (usercode == item.USER_ID) {
                      userData.splice(i, 1);
                    }
                  }
                });
                usersData.data = userData;
                console.log("去除已导入剩余user数量：" + userData.length);
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
        yield getOrganizationData(res);
        yield getUserData(res);

        //2、拼装执行组织机构sql语句
        var saveOrgs = async(function* (arr, res) {
          try {
            let tempSql = "";
            console.log("saveOrgs中arr-org数量：" + arr.length);
            arr.map(function (item) {
              let _ID = uuid.v1();
              let fathercrop = item["fathercorp"];
              if (!fathercrop) {
                fathercrop = treeNode;
              }
              fathercrop = item["pk_deptdoc"] ? item["pk_corp"] : fathercrop;

              tempSql =
                tempSql +
                "(" +
                "'" +
                _ID +
                "'," +
                "'" +
                (item["deptcode"] || item["unitcode"]) +
                "'," +
                "'" +
                (item["pk_deptdoc"] || item["pk_corp"]) +
                "'," +
                "'" +
                (item["deptname"] || item["unitname"]) +
                "'," +
                "'" +
                fathercrop +
                "'," +
                "'" +
                (item["deptlevel"] || item["corplevel"]) +
                "'),";
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
                "INSERT INTO t_interface_dept (_ID, CODE, ORG_CODE, zhCn_ORG_NAME, ORG_PARENT_CODE, ORG_LEVEL) VALUES " +
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

        var saveUsers = async(function* (arr, res) {
          try {
            let tempSql = "";
            console.log("saveUsers中arr-user数量：" + arr.length);
            arr.map(function (item) {
              let _ID = uuid.v1();
              let _loginName = item["email"] ? item["email"].split("@")[0] : "";
              if (!_loginName) {
                _loginName = item["psncode"] ? item["psncode"] : "";
              }
              let _sex = item["sex"] == "女" ? 2 : 1;
              let _poststat = item["poststat"] == "在职" ? 1 : 0;
              let _orgName = "";
              for (let i = 0; i < tempOrgsTree.length; i++) {
                if (tempOrgsTree[i].pk_deptdoc == item["pk_deptdoc"]) {
                  _orgName = tempOrgsTree[i].deptname;
                }
              }

              if (_poststat == 1 && _loginName) {
                tempSql =
                  tempSql +
                  "(" +
                  "'" +
                  _ID +
                  "'," +
                  "'" +
                  item["pk_psnbasdoc"] +
                  "'," +
                  "'" +
                  item["psncode"] +
                  "'," +
                  "'" +
                  item["psnname"] +
                  "'," +
                  "'" +
                  _loginName +
                  "'," +
                  "'9VWQmI/etl3cBAMpuLZLoE3b7jM='," +
                  "'" +
                  _sex +
                  "'," +
                  "'" +
                  item["email"] +
                  "'," +
                  "'" +
                  item["mobile"] +
                  "'," +
                  "'" +
                  item["pk_deptdoc"] +
                  "'," +
                  "'" +
                  _orgName +
                  "'," +
                  "'" +
                  _poststat +
                  "'),";
              } else {
                //console.log('item--email----------')
                //console.log(item)
              }
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
                "INSERT INTO t_interface_user (_ID, USER_ID, JOB_ID, USER_NAME, LOGON_NAME, LOGON_PASSWORD, SEX, EMAIL,TELEPHONE,ORG_ID,ORG_NAME,JOB_STATUS) VALUES " +
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
        // var makeOrgArray = function(arr1, arr2, res) {
        // 	arr2 = arr1.slice(0, 100);
        // 	arr1.splice(0, 100);
        // 	saveOrgs(arr2, res)
        // }

        // var makeUserArray = function(arr1, arr2, res) {
        // 	arr2 = arr1.slice(0, 100);
        // 	arr1.splice(0, 100);
        // 	saveUsers(arr2, res)
        // }

        //4、监听是否从webservice获得数据
        Object.defineProperty(orgsTree, "data", {
          set: function (newValue) {
            let length = newValue.length;
            let num = Math.ceil(length / 100);
            let arr2 = [];
            for (let i = 0; i < num; i++) {
              makeOrgArray(newValue, arr2);
              if (i + 1 == num) {
                res.send({ state: true });
              }
            }
          },
          get: function () {
            console.log("你取我的值");
          },
        });

        Object.defineProperty(usersData, "data", {
          set: function (newValue) {
            let length = newValue.length;
            console.log("新值的长度:" + length);
            let num = Math.ceil(length / 100);
            let arr2 = [];
            console.log("要执行sql总次数:" + num);
            for (let i = 0; i < num; i++) {
              console.log("执行sql次数:" + i);
              makeUserArray(newValue, arr2);
              if (i + 1 == num) {
                res.send({ state: true });
              }
            }
          },
          get: function () {
            console.log("你取我的值");
          },
        });
      } else {
        //创建数据库链接
        let mysqlConn = mysqlClient();
        //包装成co模式
        let mysqlConnCo = wrapper(mysqlConn);

        //从数据库获得数据并组装成树
        let sqlData = "SELECT * from t_interface_dept order by create_time asc";
        //执行搜索，将结果返回给rows
        let rows = yield mysqlConnCo.query(sqlData);

        //关闭数据库链接
        mysqlConn.end();

        //拼装tree
        function getTree(result, ORG_PARENT_CODE) {
          var rtn = [];
          const orgName = "zhCn_ORG_NAME";
          for (var i in result) {
            if (result[i].ORG_PARENT_CODE == ORG_PARENT_CODE) {
              var obj = {};
              if (req.query.userLanguage) {
                obj.label = result[i][orgName];
              } else {
                obj.label = result[i]["zhCn_ORG_NAME"];
              }
              obj.value = result[i].ORG_CODE;
              obj.key = result[i].ORG_CODE;
              obj.children = getTree(result, result[i].ORG_CODE);
              if (!obj.children.length) {
                delete obj.children;
              }

              rtn.push(obj);
            }
          }
          return rtn;
        }

        if (rows.length) {
          let obj = {};
          obj.data = getTree(rows, treeNode);
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
      let sqlData = "select * from t_interface_dept";
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

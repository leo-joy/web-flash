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
        "select * from t_sys_org limit " + startNum + "," + endNum;
      let sqlTotal = "select count(_ID) from t_sys_org";
  
      //点击右侧树
      if (ORG_CODE) {
        sqlData =
          "select * from t_sys_org where ORG_PARENT_CODE like " +
          "'%" +
          ORG_CODE +
          "%' order by create_time asc limit " +
          startNum +
          "," +
          endNum;
        sqlTotal =
          "select count(_ID) from t_sys_org where ORG_PARENT_CODE like " +
          "'%" +
          ORG_CODE +
          "%'";
      }
  
      //搜索过滤
      if (field && keyword) {
        if (ORG_CODE) {
          sqlData =
            "select * from t_sys_org where " +
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
            "select count(_ID) from t_sys_org where " +
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
            "select * from t_sys_org where " +
            field +
            " like " +
            "'%" +
            keyword +
            "%' limit " +
            startNum +
            "," +
            endNum;
  
          sqlTotal =
            "select count(_ID) from t_sys_org where " +
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
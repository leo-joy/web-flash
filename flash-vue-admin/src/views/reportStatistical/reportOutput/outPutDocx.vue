<template>
  <div class="threeLevelMain">
    <!-- 报价容器 -->
    <div class="quoteContainer">
      <!-- 报价顶部信息 -->
      <div class="quote_info clearfix">
        <h3 class="h3_title">Cherry Land International Limited 利泉國際有限公司--测试董事名册导出</h3>
        <!-- <div class="quote_itemBox">
          <div class="quote_item">
            <span class="quote_label">公司名称：</span>
            <p class="quote_p">{{form.custName}}</p>
          </div>
          <div class="quote_item">
            <span class="quote_label">联系方式：</span>
            <p class="quote_p">{{form.phoneNumber}}</p>
          </div>
        </div>
        <div class="quote_itemBox">
          <div class="quote_item">
            <span class="quote_label">项目要求：</span>
            <p class="quote_p">{{form.projectRequirement}}</p>
          </div>
          <div class="quote_item">
            <span class="quote_label">备注：</span>
            <p class="quote_p">{{form.remark}}</p>
          </div>
        </div> -->
      </div>
      <!-- 设备选取表格 -->

    </div>
    <!-- 审核备注容器 -->
    <!-- <div class="reasonBox clearfix">
      <div class="title_checkReason">审核备注：</div>
      <div class="checkReasonMain">
        <div class="p_box">
          <p class="p_checkReason">{{form.checkReason}}</p>
        </div>
      </div>
    </div> -->
    <!-- 底部按钮容器 -->
    <div class="botmBtnContainer">
      <el-button size="small" type="primary" @click="exportWord('input.docx','test.docx')">test</el-button>
      <el-button size="small" type="primary" @click="exportWord('L93-NAR1.docx','年度报表.docx')">导出年度报表</el-button>
      <el-button size="small" type="primary" @click="exportWord('Members.docx','股东名册.docx')">导出股东名册</el-button>
      <el-button size="small" type="primary" @click="exportWord('Directors.docx','利泉國際有限公司-董事名册.docx')">导出董事名册</el-button>
      <!-- <el-button @click="exportExcelClick" size="small" type="primary">导出excel</el-button> -->
    </div>
  </div>
</template>
<script>
import '@/assets/js/docxtemplater/docxtemplater.js'
import '@/assets/js/docxtemplater/jszip.js'
import '@/assets/js/docxtemplater/FileSaver.js'
import '@/assets/js/docxtemplater/jszip-utils.js'
export default {
  name: 'Home',
  data() {
    return {
      // 表单对象
      form: {
        custName: 'Cherry Land International Limited 利泉國際有限公司--测试', // 客户姓名
        phoneNumber: '138xxxxxxxx', // 联系方式
        projectRequirement: '为了更美好的明天而战', // 项目要求
        totalPrice: 140, // 合计报价
        remark: 'QEWARAEQAAAAAAAAA', // 备注
        checkReason: '同意' // 审核备注
      },
      // 表格信息
      tableData: []
    }
  },
  created() {
    this.tableData = [
      {
        number: 1, // 序号
        name: '设备1', // 设备名称
        num: 1, // 数量
        salePrice: 10, // 销售单价
        saleTotal: 10, // 销售合计
        remark: '啦啦啦' // 备注
      },
      {
        number: 2, // 序号
        name: '设备2', // 设备名称
        num: 2, // 数量
        salePrice: 20, // 销售单价
        saleTotal: 40, // 销售合计
        remark: '啦啦啦' // 备注
      },
      {
        number: 3, // 序号
        name: '设备3', // 设备名称
        num: 3, // 数量
        salePrice: 30, // 销售单价
        saleTotal: 90, // 销售合计
        remark: '啦啦啦' // 备注
      }
    ]
  },
  methods: {
    // 点击导出word
    exportWord: function(templateName, outputName) {
      const _this = this
      const _url = window.location.origin + '/static/docx/' + templateName
      // 读取并获得模板文件的二进制内容
      JSZipUtils.getBinaryContent(_url, function(error, content) {
        // input.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
        // 抛出异常
        if (error) {
          throw error
        }

        // 创建一个JSZip实例，内容为模板的内容
        const zip = new JSZip(content)
        // 创建并加载docxtemplater实例对象
        const doc = new window.docxtemplater().loadZip(zip)
        // 设置模板变量的值
        doc.setData({
          ..._this.form,
          table: _this.tableData
        })

        try {
          // 用模板变量的值替换所有模板变量
          doc.render()
        } catch (error) {
          // 抛出异常
          const e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties
          }
          console.log(JSON.stringify({ error: e }))
          throw error
        }

        // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
        // 将目标文件对象保存为目标类型的文件，并命名
        saveAs(out, outputName)
      })
    }
  }
}
</script>
<style lang="scss">
.threeLevelMain {
	margin: 0;
	padding: 0;
	font-size: 12px;
	font-family: "微软雅黑", "宋体";
	list-style: none;
	box-sizing: border-box;
}
// 清除浮动
.clearfix:after {
  content: "";
  height: 0;
  line-height: 0;
  display: block;
  clear: both;
  visibility: hidden;
}

.clearfix {
  zoom: 1;
}
.quoteContainer {
  .quote_info {
    width: 800px;
    margin: 0 auto;
    .h3_title {
      float: left;
      width: 100%;
      font-size: 20px;
      line-height: 40px;
      text-align: center;
      margin-bottom: 30px;
    }
    .quote_itemBox {
      float: left;
      width: 100%;
      margin-bottom: 20px;
      .quote_item {
        float: left;
        width: 50%;
        display: flex;
        .quote_label {
          width: 100px;
          text-align: right;
          line-height: 32px;
        }
        .quote_p {
          flex: 1;
          line-height: 32px;
        }
      }
    }
  }
  .quote_table {
    padding: 0 20px;
    .table_domQuote {
      .quoteTable {
        font-size: 14px;
        padding-left: 30px;
        border-top: 1px solid #ebeef5;
        .quoteTable_sp1 {
          display: inline-block;
          line-height: 50px;
        }
      }
    }
  }
}
.reasonBox {
  padding: 0 20px 20px 20px;
  .title_checkReason {
    line-height: 50px;
  }
  .checkReasonMain {
    .p_box {
      border: 1px solid #ebeef5;
      padding: 10px 20px;
      .p_checkReason {
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
// 底部按钮
.botmBtnContainer {
  text-align: center;
  padding: 20px;
}
</style>

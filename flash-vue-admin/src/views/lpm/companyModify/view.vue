<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="item in companyModifyData" :key="item.id" :timestamp="item.createTime" placement="top">
        <el-card>

          <el-row>
            <el-col :span="24">
              <h4>变更理由：{{ item.applyReason }}</h4>
            </el-col>
            <el-col :span="24">
              <table class="dp-table" border="1">
                <tr>
                  <th width="15%">变更事项</th>
                  <th width="35%">变更前</th>
                  <th width="35%">变更后</th>
                  <th width="15%">变更日期</th>
                </tr>
                <tr v-if="item.enterpriseNameState === 'true'">
                  <td>企业名称</td>
                  <td>{{ item.enterpriseNameOld }}</td>
                  <td>{{ item.enterpriseNameNew }}</td>
                  <td>{{ item.modifyDate.replace("00:00:00","") }}</td>
                </tr>
                <tr v-if="item.registeredAddressState === 'true'">
                  <td>注册地址</td>
                  <td>{{ item.registeredAddressOld }}</td>
                  <td>{{ item.registeredAddressNew }}</td>
                  <td>{{ item.modifyDate.replace("00:00:00","") }}</td>
                </tr>
                <tr v-if="item.businessScopeState === 'true'">
                  <td>经营范围</td>
                  <td>{{ item.businessScopeOld }}</td>
                  <td>{{ item.businessScopeNew }}</td>
                  <td>{{ item.modifyDate.replace("00:00:00","") }}</td>
                </tr>
              </table>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="24">
              <h4 v-if="item.enterpriseNameState === 'true'"><b>企业名称变更：</b>由【 <i>{{ item.enterpriseNameOld }}</i>】变更为 【<i>{{ item.enterpriseNameNew }}</i>】</h4>
              <h4 v-if="item.registeredAddressState === 'true'"><b>注册地址变更：</b>由【 {{ item.registeredAddressOld }}】变更为 【{{ item.registeredAddressNew }}】</h4>
              <h4 v-if="item.businessScopeState === 'true'"><b>经营范围变更：</b></h4>
              <p v-if="item.businessScopeState === 'true'">原经营范围：{{ item.businessScopeOld }}</p>
              <p v-if="item.businessScopeState === 'true'">新经营范围：{{ item.businessScopeNew }}</p>
              <p>变更理由：{{ item.applyReason }}</p>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="24" />
            <el-col v-if="item.accessoryFilesListCompanyModify && item.accessoryFilesListCompanyModify.length>0" :span="24">
              <FilesListComponent file-title="相关附件" :files-list="item.accessoryFilesListCompanyModify" />
            </el-col>
          </el-row>
        </el-card>
      </el-timeline-item>
      <el-timeline-item v-if="companyModifyData.length === 0">
        <el-card>
          <el-row>
            <el-col :span="24">
              <p>暂无相关的变更记录</p>
            </el-col>
          </el-row>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<style lang="scss">
.dp-table {
    width:100%;
  border:1px solid #ccc;
  border-collapse:collapse;
}

.dp-table th, .dp-table td {
    padding: 10px;
}

.dp-table th{
    margin:5px;
    text-align: center;
    background-color: #efefef;
}
.dp-table td b{
    margin: 10px 5px;
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
// 底部按钮
.botmBtnContainer {
  text-align: center;
  padding: 20px;
}
</style>
<script src="./view.js"></script>

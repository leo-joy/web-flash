<template>
  <div class="block">
    <el-row>
      <el-col>
        <el-table :data="shareholderData" style="width: 100%">
          <el-table-column label="股东">
            <template slot-scope="scope">
              <el-button type="text" @click="detail(scope.row)">{{ scope.row.shareholder }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="占比（%）" width="100">
            <template
              slot-scope="scope"
            >{{ scope.row.proportion }}</template>
          </el-table-column>
          <el-table-column
            prop="shareholderType"
            label="类型"
            :formatter="formatterShareholderType"
            width="160"
          />
          <el-table-column
            prop="status"
            label="状态"
            :formatter="formatterShareholderStatus"
            width="100"
          />
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <h4>&nbsp;&nbsp;&nbsp;&nbsp;投资关系图</h4>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div style="height:510px;width:100%;">
          <iframe
            :src="src"
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="auto"
            style="background-color:#efefef;position:relative;top:0;left:0;bottom:0px;right:0px;"
          />
        </div>
      </el-col>
    </el-row>

  </div>

</template>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.block {
  position: relative;
  top: -20px;
  left: -10px;
  z-index: 10;
}
</style>
<script src="./view.js"></script>

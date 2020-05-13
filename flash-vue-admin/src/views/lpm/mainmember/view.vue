<template>
  <div class="app-container">
    <div class="block">
      <el-table :data="mainmemberData" style="width: 100%">
        <el-table-column prop="chairman" label="董事长" width="100">
          <template slot-scope="scope">
            <!-- <el-button
                        type="text"
                        @click="userDetail(scope.row, 'chairman', scope.row.chairman)"
                      >{{ scope.row.chairman }}</el-button> -->
            <el-button
              type="text"
            >{{ scope.row.chairman }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="director" label="董事">
          <template slot-scope="scope">
            <!-- <el-button
                        v-for="(name, i) in scope.row.director.split('、')"
                        :key="i"
                        type="text"
                        @click="userDetail(scope.row, 'director', name)"
                      >{{ name }}</el-button> -->
            <el-button
              v-for="(name, i) in scope.row.director.split('、')"
              :key="i"
              type="text"
            >{{ name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="supervisor" label="监事" width="100">
          <template slot-scope="scope">
            <!-- <el-button
                        type="text"
                        @click="userDetail(scope.row, 'supervisor', scope.row.supervisor)"
                      >{{ scope.row.supervisor }}</el-button> -->
            <el-button
              type="text"
            >{{ scope.row.supervisor }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="generalManager" label="总经理" width="100">
          <template slot-scope="scope">
            <!-- <el-button
                        type="text"
                        @click="userDetail(scope.row, 'generalManager', scope.row.generalManager)"
                      >{{ scope.row.generalManager }}</el-button> -->
            <el-button
              type="text"
            >{{ scope.row.generalManager }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row v-if="accessoryFilesListMainmember.length>0">
        <el-col :span="24">
          <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListMainmember" />
        </el-col>
      </el-row>

    </div>
    <el-dialog :title="userInfoTitle" :visible.sync="userInfoVisible" width="60%">
      <template>
        <el-form label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名：">{{ userInfoList.name }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文名：">{{ userInfoList.name }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号：">{{ userInfoList.workNumber }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别：">{{ userInfoList.sexName }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="电话：">{{ userInfoList.phone }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱：">{{ userInfoList.email }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.el-collapse-item__wrap {
  border: #ebeff5 dashed 1px;
  border-radius: 10px;
}
.dp-table-expand {
  font-size: 0;
}
.dp-table-expand label {
  width: 150px;
  color: #99a9bf;
}
.dp-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.dp-row {
  padding: 10px;
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
//
.my-menu-vertical {
 position:fixed;
 top:180px;
 right:30px;
 z-index:10;
}
.my-menu-vertical .el-menu-item {
  height:36px;
  line-height: 36px;
}
</style>
<script src="./view.js"></script>

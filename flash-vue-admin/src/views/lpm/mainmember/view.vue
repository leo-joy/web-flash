<template>
  <div class="app-container">
    <div class="block">
      <el-table :data="mainmemberData" style="width: 100%">
        <el-table-column v-if="registrationType !== 2" prop="chairman" label="董事长" width="100">
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
        <el-table-column v-if="registrationType !== 2" prop="supervisor" label="监事" width="180">
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
        <el-table-column v-if="registrationType !== 2" prop="generalManager" label="总经理" width="100">
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

</style>
<script src="./view.js"></script>

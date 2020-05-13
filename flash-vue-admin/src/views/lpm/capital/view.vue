<template>
  <el-row>
    <el-col :span="24">
      <el-table :data="capitalData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="dp-table-expand">
              <el-form-item label="股东">
                <span>{{ props.row.shareholder }}</span>
              </el-form-item>
              <el-form-item label="占比（%）">
                <span>{{ props.row.proportion }}</span>
              </el-form-item>
              <el-form-item label="认缴出资方式">
                <span>{{ formatterSubscribedCapitalType(props.row) }}</span>
              </el-form-item>
              <el-form-item label="认缴出资额（万元）">
                <span>{{ props.row.subscribedCapitalContribution }}</span>
              </el-form-item>
              <el-form-item label="认缴出资日期">
                <span>{{ props.row.subscribedCapitalDate.replace(' 00:00:00','') }}</span>
              </el-form-item>
              <el-form-item label="实缴出资方式">
                <span>{{ formatterRealityCapitalType(props.row) }}</span>
              </el-form-item>
              <el-form-item label="实缴出资额（万元）">
                <span>{{ props.row.realityCapitalContribution }}</span>
              </el-form-item>
              <el-form-item label="实缴出资日期">
                <span>{{ props.row.realityCapitalDate.replace(' 00:00:00','') }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="shareholder" label="股东" />
        <el-table-column label="占比（%）">
          <template
            slot-scope="scope"
          >{{ scope.row.proportion }}</template>
        </el-table-column>

        <el-table-column
          prop="subscribedCapitalContribution"
          label="认缴出资额（万元）"
          width="100"
        />
        <el-table-column
          prop="realityCapitalContribution"
          label="实缴出资额（万元）"
          width="100"
        />
        <el-table-column label="实缴出资日期" width="120">
          <template
            slot-scope="scope"
          >{{ scope.row.realityCapitalDate.replace(' 00:00:00','') }}</template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col v-if="accessoryFilesListCapital.length>0" :span="24">
      <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListCapital" />
    </el-col>
  </el-row>
</template>
<style lang="scss">

</style>
<script src="./view.js"></script>

<template>
  <div class="app-container">
    <div v-if="advancedSearch" class="block">
      <!-- <el-row>
        <el-col :span="24">
          <el-button type="success" icon="el-icon-plus" @click.native="add">{{ $t('button.add') }}</el-button>
          <el-button type="primary" icon="el-icon-edit" @click.native="edit">{{ $t('button.edit') }}</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click.native="remove"
          >{{ $t('button.delete') }}</el-button>
        </el-col>
      </el-row>-->
      <el-row>
        <el-col :span="2">
          <template>
            <el-radio v-model="tagRadio" label="" @change="handleTagRadioClick">全部标签</el-radio>
          </template>
        </el-col>
        <el-col :span="22">
          <template>
            <el-radio v-model="tagRadio" label="1" @change="handleTagRadioClick">控股集团【股票代码：3383】</el-radio>
            <el-radio v-model="tagRadio" label="2" @change="handleTagRadioClick">雅生活集团【股票代码：3319】</el-radio>
            <el-radio v-model="tagRadio" label="3" @change="handleTagRadioClick">体外公司</el-radio>
            <el-radio v-model="tagRadio" label="5" @change="handleTagRadioClick">跟投业务</el-radio>
            <el-radio v-model="registrationTypeRadio" label="1,4" @change="handleRegistrationTypeRadioClick">国内企业</el-radio>
            <el-radio v-model="registrationTypeRadio" label="2" @change="handleRegistrationTypeRadioClick">境外/香港企业</el-radio>
          </template>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :span="2">
          <template>
            <el-radio v-model="registrationTypeRadio" label="1,2,4" @change="handleRegistrationTypeRadioClick">全部企业</el-radio>
          </template>
        </el-col>
        <el-col :span="22">
          <template>
            <el-radio v-model="deptRadio" label="-244_" @change="handleRadioClick">控股公司</el-radio>
            <el-radio v-model="deptRadio" label="-51_" @change="handleRadioClick">雅生活集团</el-radio>
            <el-radio v-model="deptRadio" label="-103_" @change="handleRadioClick">雅城集团</el-radio>
            <el-radio v-model="deptRadio" label="-104_" @change="handleRadioClick">教育集团</el-radio>
            <el-radio v-model="deptRadio" label="-102_" @change="handleRadioClick">环保集团</el-radio>
            <el-radio v-model="deptRadio" label="-106_" @change="handleRadioClick">资本集团</el-radio>
            <el-radio v-model="deptRadio" label="-105_" @change="handleRadioClick">房管集团</el-radio>
            <el-radio v-model="deptRadio" label="-107_" @change="handleRadioClick">商业集团</el-radio>
            <el-radio v-model="deptRadio" label="-108_" @change="handleRadioClick">城更集团</el-radio>
            <el-radio v-model="deptRadio" label="-248_" @change="handleRadioClick">跟投公司</el-radio>
          </template>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :span="2">
          <template>
            <el-radio v-model="deptRadio" label="-27_" @change="handleRadioClick">地产集团</el-radio>
          </template>
        </el-col>
        <el-col :span="22">
          <template>
            <el-radio v-model="deptRadio" label="-30_" border size="mini" @change="handleRadioClick">集团本部</el-radio>
            <el-radio v-model="deptRadio" label="-32_" border size="mini" @change="handleRadioClick">广州区域</el-radio>
            <el-radio v-model="deptRadio" label="-37_" border size="mini" @change="handleRadioClick">中山区域</el-radio>
            <el-radio v-model="deptRadio" label="-43_" border size="mini" @change="handleRadioClick">北京区域</el-radio>
            <el-radio v-model="deptRadio" label="-40_" border size="mini" @change="handleRadioClick">上海区域</el-radio>
            <el-button
              v-permission="['/businesslicense/ca']"
              size="small"
              @click.native="businessCirclesSynErgodic()"
            >{{ $t('button.businessCirclesSyn') }}</el-button>
          </template>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :span="2">
          <div>&nbsp;</div>
        </el-col>
        <el-col :span="22">
          <template>
            <el-radio v-model="deptRadio" label="-41_" border size="mini" @change="handleRadioClick">南京区域</el-radio>
            <el-radio v-model="deptRadio" label="-46_" border size="mini" @change="handleRadioClick">重庆区域</el-radio>
            <el-radio v-model="deptRadio" label="-42_" border size="mini" @change="handleRadioClick">西安区域</el-radio>
            <el-radio v-model="deptRadio" label="-39_" border size="mini" @change="handleRadioClick">海南区域</el-radio>
            <el-radio v-model="deptRadio" label="-45_" border size="mini" @change="handleRadioClick">云南区域</el-radio>
            <!-- <el-button
                v-permission="['/lpm/businesslicenseEdit']"
                type="success"
                icon="el-icon-add"
                @click.native="addCompany('/lpm/businesslicenseEdit')"
              >{{ $t('button.add') }}</el-button> -->
            <el-button
              v-permission="['/businesslicense/ca']"
              size="small"
              @click.native="investCompanySynErgodic()"
            >同步投资公司</el-button>
            <el-button
              v-permission="['/businesslicense/export']"
              size="small"
              @click.native="exportExcel"
            >导出结果报表</el-button>
          </template>
        </el-col>
      </el-row>
      <br>

      <!-- <el-col :span="5">
          <el-input v-model="filterText" class="filterInput" placeholder="输入关键字进行树过滤" />
          <div ref="treecontainer" class="filter-tree">
            <el-tree
              ref="tree"
              :data="deptTree.data"
              :props="deptTree.defaultProps"
              default-expand-all
              :filter-node-method="filterNode"
              @node-click="handleLeftNodeClick"
            />
          </div>

        </el-col> -->
    </div>
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-row :gutter="24">
            <el-col :span="4">
              <el-select v-model="searchType" placeholder="搜索类型" @change="searchTypeHander">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="14">
              <el-input v-model="keyword" placeholder="请输入搜索关键字" />
            </el-col>

            <el-col :span="3">
              <el-button
                type="success"
                icon="el-icon-search"
                @click.native="search"
              >{{ $t('button.search') }}</el-button>
            </el-col>
            <el-col :span="2">
              <el-button
                :icon="advancedSearchIcon"
                @click.native="openAdvancedSearch"
              >高级搜索</el-button>
            </el-col>
          </el-row>
          <br>
          <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading"
            border
            highlight-current-row
            class="my-table"
            empty-text="暂无数据"
            @current-change="handleCurrentChange"
          >
            <el-table-column label="序号" type="index" width="50" />
            <el-table-column label="企业名称" width="300">
              <template slot-scope="scope">
                <el-button type="text" @click="detail(scope.row)">{{ scope.row.enterpriseName }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="统一社会信用代码/登记号" width="200">
              <template slot-scope="scope">{{ scope.row.unifiedSocialCreditCode }}</template>
            </el-table-column>
            <el-table-column label="注册资本/股本(万元)" width="150">
              <template slot-scope="scope">{{ scope.row.registeredCapital }}</template>
            </el-table-column>
            <el-table-column v-if="registrationTypeRadio*1!==2" label="法定代表人" width="100">
              <template slot-scope="scope">{{ scope.row.legalRepresentative }}</template>
            </el-table-column>
            <el-table-column v-if="(searchType === 'chairman' || searchType === 'director' || searchType === 'supervisor' || searchType === 'generalManager') && keyword !== ''" label="董事长" width="100">
              <template slot-scope="scope">{{ scope.row.chairman }}</template>
            </el-table-column>
            <el-table-column v-if="(searchType === 'chairman' || searchType === 'director' || searchType === 'supervisor' || searchType === 'generalManager') && keyword !== ''" label="董事" width="200">
              <template slot-scope="scope">{{ scope.row.director }}</template>
            </el-table-column>
            <el-table-column v-if="(searchType === 'chairman' || searchType === 'director' || searchType === 'supervisor' || searchType === 'generalManager') && keyword !== ''" label="监事" width="120">
              <template slot-scope="scope">{{ scope.row.supervisor }}</template>
            </el-table-column>
            <el-table-column v-if="(searchType === 'chairman' || searchType === 'director' || searchType === 'supervisor' || searchType === 'generalManager') && keyword !== ''" label="总经理" width="100">
              <template slot-scope="scope">{{ scope.row.generalManager }}</template>
            </el-table-column>
            <el-table-column label="成立日期" width="100">
              <template slot-scope="scope">{{ scope.row.setupDate.replace(' 00:00:00', '') }}</template>
            </el-table-column>
            <el-table-column
              prop="registrationStatus"
              label="状态"
              :formatter="formatterRegistrationStatus"
            />
            <!-- <el-table-column v-if="moduleType !== 'dashboard'" label="投资同步状态" width="140">
              <template slot-scope="scope">{{ scope.row.initInvest*1 ===1?"已同步":'' }}</template>
            </el-table-column> -->
            <el-table-column v-if="moduleType !== 'dashboard'" label="操作" width="80">
              <template slot-scope="scope">
                <el-button v-if="moduleType == '2' && registrationTypeRadio*1===2" v-permission="['/editCompanyHw']" type="text" @click="modifyHw(scope.row)">{{ $t('button.modity') }}</el-button>
                <el-button v-if="moduleType == '2' && registrationTypeRadio*1!==2" v-permission="['/editCompany']" type="text" @click="modify(scope.row)">{{ $t('button.modity') }}</el-button>
                <el-button v-if="moduleType == '1'" v-permission="['/enterprisemanage']" type="text" @click="edit(scope.row)">{{ $t('button.edit') }}</el-button>
                <!-- <el-button type="text" @click="detail(scope.row)">详情</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <br>
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100,500]"
            :page-size="listQuery.limit"
            :current-page="listQuery.page"
            :total="total"
            @size-change="changeSize"
            @current-change="fetchPage"
            @prev-click="fetchPrev"
            @next-click="fetchNext"
          />
        </el-col>
      </el-row>
    </div>

    <el-dialog :title="formTitle" :visible.sync="formVisible" width="70%">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="组织机构">
              <el-input
                v-model="form.pname"
                placeholder="请选择组织机构"
                readonly="readonly"
                @click.native="deptTree.show = !deptTree.show"
              />
              <el-tree
                v-if="deptTree.show"
                empty-text="暂无数据"
                :expand-on-click-node="false"
                :data="deptTree.data"
                :props="deptTree.defaultProps"
                class="input-tree"
                @node-click="handleNodeClick"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称">
              <el-input v-model="form.enterpriseName" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业类型">
              <el-input v-model="form.type" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-input v-model="form.status" minlength="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./enterprise_info.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.filterInput {
  width: 90%
}
.filter-tree {
  overflow-y: auto;
  height: 500px;
}
.my-table >>> td {
  padding: 0 0;
}
</style>


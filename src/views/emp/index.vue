<script setup>
import { ref, onMounted, watch } from 'vue';
import { queryPageApi } from '@/views/api/emp'
// 搜索表单数据模型
const searchEmp = ref({
  name: '',
  gender: '',
  date: [],
  begin: '',
  end: ''
})

// 查询员工列表
const search = async () => {
  console.log("开始查询")
  const result = await queryPageApi(searchEmp.value.name, 
                                    searchEmp.value.gender, 
                                    searchEmp.value.begin, 
                                    searchEmp.value.end, 
                                    currentPage.value, 
                                    pageSize.value)
  console.log("查询结束")
  if(result.code){
    console.log("查询成功")
    total.value = result.data.total
    empListData.value = result.data.rows
    console.log(result.data.rows)

  }

}

// 清空员工列表
const clear = () => {
  searchEmp.value = {
    name: '',
    gender: '',
    date: [],
    begin: '',
    end: ''
  }
}

// 监听日期范围变化，更新开始和结束日期
watch(()=> searchEmp.value.date, (newDate, oldDate)=>{
  if(newDate.length == 2){
    searchEmp.value.begin = newDate[0]
    searchEmp.value.end = newDate[1]
  }
})

// 员工列表数据
const empListData = ref([
  {
    "id": 23,
    "username": "ruanji",
    "name": "阮籍",
    "gender": 1,
    "job": 5,
    "salary": 5800,
    "image": "https://images.pexels.com/photos/2201541/pexels-photo-2201541.jpeg?w=800",
    "entryDate": "2012-01-01",
    "deptId": 3,
    "createTime": "2023-10-20 16:35:33",
    "updateTime": "2023-10-20 16:36:19",
    "deptName": "咨询部"
  }
])

// 分页条数据
const currentPage = ref(1)    // 页码
const pageSize = ref(5)     // 默认展示的页面数
const background = ref(true)  // 是否显示背景色
const total = ref(0)          // 总记录数


// 每页展示记录数变化时触发
const handleSizeChange = (val) => {
  console.log(`每个展示的记录：${val}`)
  search()
}
// 页码变化的时候触发
const handleCurrentChange = (val) => {
  console.log(`当前页面： ${val}`)
  search()
}


onMounted(() => {
  search()
})

</script>

<template>
  <h1>员工管理</h1>
  <!-- 搜索表单 -->
  <div class="container">
    <!-- 行内表单 -->
     <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="searchEmp.name" placeholder="请输入员工姓名" clearable />
      </el-form-item>
      <el-form-item label="性别">
        <el-select
          v-model="searchEmp.gender"
          placeholder="请选择"
          clearable
        >
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker
          v-model="searchEmp.date"
          type="daterange"
          range-separator="到"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :size="size"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 功能按钮 -->
  <div class="container">
    <el-button type="primary" @click="">+新增员工</el-button>
    <el-button type="danger" @click="">-批量删除</el-button>
  </div>
  <!-- 表格组件 -->
  <div class="container">
    <el-table :data="empListData" style="width: 100%">
       <el-table-column type="selection" width="55" align="center"/>
      <el-table-column prop="name" label="姓名" width="120" align="center"/>
      <el-table-column label="性别" width="120" align="center">
        <template #default="scope">
          {{ scope.row.gender === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="头像" width="120" align="center">
        <template #default="scope">
          <image :src="scope.row.image" height="40px"></image>
        </template>
      </el-table-column>
      <el-table-column prop="job" label="职位" width="120" align="center">
        <template #default="scope">
          <span v-if="scope.row.job == 1">班主任</span>
          <span v-else-if="scope.row.job == 2">讲师</span>
          <span v-else-if="scope.row.job == 3">学工主管</span>
          <span v-else-if="scope.row.job == 4">教研主管</span>
          <span v-else-if="scope.row.job == 5">咨询师</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="所属部门" width="120" align="center"/>
      <el-table-column prop="entryDate" label="入职日期" width="180" align="center"/>
      <el-table-column prop="updateTime" label="更新时间" width="180" align="center"/>
       <el-table-column label="操作"  align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="">编辑</el-button>
          <el-button link type="danger" size="small" @click="">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 分页条 -->
  <div class="container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 30, 50, 75, 100]"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>


<style scoped>
.container {
  margin: 10px 0px;
}
</style>
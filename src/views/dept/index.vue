<script setup>
import { ref, onMounted } from 'vue';
import { queryAllApi, addDeptApi, queryByIdApi, updateDeptByIdApi, deleteByIdApi } from '@/views/api/dept'
import { ElMessage, ElMessageBox} from 'element-plus'


const deptList = ref([])
const dialogFormVisible = ref(false)  // dialog对话框是否显示
const dept = ref({
  name: ''
})
const formTitle = ref('')

const addDept = ()=>{
  formTitle.value = '新增部门'
  dept.value = {
    name: ''
  }
  dialogFormVisible.value = true
  if(deptFormRef.value){
    deptFormRef.value.resetFields()
  }else{
    return 
  }
  
}
const save = async (deptFormRef)=>{
  if(!deptFormRef){
    return
  }
  // valid参数表示是否校验通过
  deptFormRef.validate(async (valid)=>{
    let result;
    if(valid){
      if(dept.value.id){
        result = await updateDeptByIdApi(dept.value)
      }else{
        result = await addDeptApi(dept.value)
      }
      

      if(result.code){
        // 保存成功，提示
        ElMessage({
          message: '保存成功',
          type: 'success',
        })
        // 关闭对话框
        dialogFormVisible.value = false
        // 刷新列表
        search()
      }else{
        // 保存失败，提示
        ElMessage.error(result.msg)
      }
    }else{
      ElMessage.error('表单校验失败，请检查输入')
    }
  })
  
}

// 查询部门列表
const search = async () => {
  const result = await queryAllApi()
  if(result.code){
    deptList.value = result.data
  }
}

// 表单校验规则
const rules = ref({
  name: [
    { required: true, message: '部门名称不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '部门名称的长度应该在2-10个字符之间', trigger: 'blur' },
  ]
})

const deptFormRef = ref()

// 编辑部门
const edit = async (id)=>{
  if(deptFormRef.value){
    deptFormRef.value.resetFields()
  }
  const result = await queryByIdApi(id)
  if(result.code){
    formTitle.value = '编辑部门'
    dialogFormVisible.value = true
    dept.value = result.data
  }

}

// 删除部门
const deleteById = async (id)  => {
  // 消息提示框
  ElMessageBox.confirm(
    '你确定删除该部门吗？',
    '提示',
    {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}
  ).then(async () => {
      const result= await deleteByIdApi(id)
      if(result.code){
        ElMessage.info('删除成功')
        search()
      }else{
        ElMessage.error(result.msg)
      }
    })
    .catch(() => {
      ElMessage.info('删除已取消')
    })

}

onMounted(() => {
  search();
})

</script>

<template>
  <h1>部门管理</h1>
  <div class="container">
    <el-button type="primary" @click="addDept">
      +新增部门
    </el-button>
  </div>

  <!-- 对话框 -->
   <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item label="部门名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="dept.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save(deptFormRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  
  <!-- 表格属性 -->
  <div>
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column type="index" width="180" label="序号" align="center"/>
      <el-table-column prop="name" label="部门名称" width="180" align="center"/>
      <el-table-column prop="updateTime" label="最后操作时间" width="300" align="center"/>
      <el-table-column label="操作"  align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="edit(scope.row.id)">
            编辑
          </el-button>
          <el-button link type="danger" size="small" @click="deleteById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.container{
  margin: 10px 0px
}
</style>

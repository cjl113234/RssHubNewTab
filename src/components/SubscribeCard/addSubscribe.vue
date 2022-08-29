<template>
  <div class="addSubscribe">
    <el-dialog v-model="addSubscribeDialogVisible" title="添加订阅"  custom-class="addSubscribeDialog" @close="handleDialogClose()">
    <el-form :model="addSubscribeForm" ref="addSubscribeFormRef" :rules="addSubscribeRules">
      <el-form-item label="订阅名称：" prop="label">
        <el-input v-model="addSubscribeForm.label" autocomplete="off" />
      </el-form-item>
      <el-form-item label="订阅地址：" prop="value">
        <el-input v-model="addSubscribeForm.value" autocomplete="off" />
      </el-form-item>
      <div>
        <el-alert type="info" show-icon>
          <template #title>
            <p>Tips：默认添加到第一级，您可以通过<span style="color: red;font-weight: bold;margin: 0 5px;">拖拽</span>归类到任意收藏夹</p>
          </template>
        </el-alert>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleDialogClose()">取消</el-button>
        <el-button type="success" @click="handleAddSubscribe(addSubscribeFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import type { FormInstance, FormRules } from 'element-plus'

const props = defineProps({
  addSubscribeDialogVisible:Boolean,
  subscribeList:Array
})

const emits = defineEmits(['dialogClose','addSubscribe']);


let addSubscribeForm = ref({
  id: Number(window.localStorage.getItem('subscribeID')),
  label: "",
  value: ""
})
const addSubscribeFormRef = ref<FormInstance>()
const addSubscribeRules = reactive<FormRules>({
  label: [
    { required: true, message: '请输入订阅名称', trigger: 'blur' },
    { min: 1, max: 6, message: '太长太短都不好哦', trigger: 'blur' },
  ],
  value: [
    { required: true, message: '请输入订阅地址', trigger: 'blur' },
  ]
})

const handleAddSubscribe = async (formEl: FormInstance | undefined) => {
  // console.log(Number(window.localStorage.getItem('subscribeID')) + 1)
  // console.log(form)
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      emits('addSubscribe',addSubscribeForm.value)
      window.localStorage.setItem('subscribeID',(Number(window.localStorage.getItem('subscribeID')) + 1).toString())
    }
  })
}

const handleDialogClose = () => {
  emits('dialogClose')
    addSubscribeForm.value = {
    id: Number(window.localStorage.getItem('subscribeID')),
    label: '',
    value: ''
  }
}


</script>

<style scoped lang="scss">
.addSubscribe{

  :deep .el-overlay-dialog{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :deep .addSubscribeDialog{
    max-width: 30%;
    min-width: 200px;
    margin: 20px;
    flex:1;
    // overflow-y: scroll;
    background: #fff;
    border: 1px solid white;
    border-radius: 7px;
  }
}
</style>

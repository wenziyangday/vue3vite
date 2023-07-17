<template>
  <a-form
    class="form-login"
    :model="formState"
    name="basic"
    :wrapper-col="{ span: 24 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-model:value="formState.username" />
    </a-form-item>
    <a-form-item
      label="Password"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password v-model:value="formState.password" autocomplete />
    </a-form-item>
    <a-form-item
      label="Code"
      name="code"
      :rules="[{ required: true, message: 'Please input your code!' }]"
    >
      <a-input v-model:value="formState.code" />
      <img :src="codeUrl" alt="" v-if="codeUrl" @click="handleCodeImg" />
    </a-form-item>
    <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
      <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from 'vue';

import { getCodeImg } from '@/apis/login';

// 验证码图片
const codeUrl = ref();

interface FormState {
  username: string;
  password: string;
  code: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  code: '',
  remember: true
});
const onFinish = (values: any): void => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any): void => {
  console.log('Failed:', errorInfo);
};

interface ImgCodeType {
  code: string;
  img: string;
}

// 处理codeImg
const handleCodeImg = async (): void => {
  const res: ImgCodeType = await getCodeImg();
  codeUrl.value = `data:image/gif;base64,${res.img}`;
};

onBeforeMount(() => {
  handleCodeImg();
});
</script>

<style lang="less" scoped>
.form-login {
  height: 100vh;
  padding-top: 30vh;
  margin: 0 30vw;
}
</style>

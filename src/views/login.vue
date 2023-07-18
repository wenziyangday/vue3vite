<template>
  <div class="form-login">
    <a-form
      :model="formState"
      name="basic"
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
        v-if="captchaEnabled"
      >
        <a-space align="center">
          <a-input v-model:value="formState.code" />
          <img :src="codeUrl" alt="" v-if="codeUrl" @click="handleCodeImg" />
        </a-space>
      </a-form-item>
      <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
        <a-checkbox v-model:checked="formState.remember"
          >Remember me</a-checkbox
        >
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit" :loading="buttonLoading">
          <span v-if="!buttonLoading">submit</span>
          <span v-else>Submit......</span>
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getCodeImg } from '@/apis/login';
import { useUser } from '@/stores/user';
import { type UserInfoForm } from '@/types/userInfo';

// 验证码图片
const codeUrl = ref<string>();

// 验证码开关
const captchaEnabled = ref<boolean>(true);

// 强制跳转路径
const redirect = ref<string>();

// 登录loading
const buttonLoading = ref<boolean>(false);

// 表单
const formState = reactive<UserInfoForm>({
  username: '',
  password: '',
  code: '',
  remember: true,
  uuid: ''
});

const onFinish = (values: any): void => {
  buttonLoading.value = true;
  const user = useUser();
  user
    .loginACT({ ...formState, ...values })
    .then(() => {
      const router = useRouter();
      void router.push(redirect.value ?? '/');
    })
    .catch(() => {
      buttonLoading.value = false;
      if (captchaEnabled.value) {
        handleCodeImg();
      }
    });
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
  captchaEnabled.value = res.captchaEnabled ?? true;

  if (captchaEnabled.value) {
    codeUrl.value = `data:image/gif;base64,${res.img}`;
    formState.uuid = res.uuid;
  }
};

onBeforeMount(() => {
  handleCodeImg();
});
</script>

<style lang="less" scoped>
.form-login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>

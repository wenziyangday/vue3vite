<script setup lang="ts">
import { Modal } from 'ant-design-vue';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useUser } from '@/stores/user';

const router = useRouter();
const levelList = ref<any[]>([]);
const imgSrc = ref<string>();
const user = useUser();

/**
 * 获取面包屑路由
 * */
const getBreadcrumbs = (): void => {
  let matched = router.currentRoute.value.matched.filter(
    (item) => item.meta?.title
  );

  const [first] = matched;
  if (!isDashboard(first)) {
    matched = [{ path: '/index', meta: { title: '首页' } }].concat(matched);
  }

  levelList.value = matched.filter(
    (item) => item?.meta.title && item.meta.breadcrumb !== false
  );
};

/**
 * 判断是不是首页
 * */
const isDashboard = (route): boolean => {
  const { name } = route;
  if (!name) {
    return false;
  }
  return name.trim() === 'Index';
};

/**
 * 退出登录
 * */
const handleLogout = (): void => {
  Modal.confirm({
    title: '提示',
    content: '确定注销并退出系统吗？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      void user.logoutACT().then(() => {
        location.href = '/index';
      });
    }
  });
};

const handleMount = (): void => {
  getBreadcrumbs();
  imgSrc.value = user.avatar;
};
onMounted(() => {
  handleMount();
});

watch(
  () => router.currentRoute.value,
  () => {
    getBreadcrumbs();
  }
);
</script>

<template>
  <div class="top-bar">
    <a-row justify="space-between " align="middle" class="breadcrumb-opt">
      <a-col>
        <transition>
          <a-breadcrumb>
            <a-breadcrumb-item v-for="item in levelList" :key="item.path">
              {{ item.meta.title }}
            </a-breadcrumb-item>
          </a-breadcrumb>
        </transition>
      </a-col>
      <a-col>
        <a-row align="middle" :gutter="10">
          <a-col>
            <a-tooltip>
              <template #title>搜索</template>
              <search-outlined style="font-size: 16px" />
            </a-tooltip>
          </a-col>
          <a-col>
            <a-tooltip>
              <template #title>全屏</template>
              <fullscreen-outlined style="font-size: 16px" />
            </a-tooltip>
          </a-col>
          <a-col>
            <a-tooltip>
              <template #title>布局大小</template>
              <plus-square-outlined style="font-size: 16px" />
            </a-tooltip>
          </a-col>
          <a-col>
            <a-dropdown>
              <a class="ant-dropdown-link" @click.prevent>
                <img :src="imgSrc" class="user-avatar" />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="0">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="http://www.alipay.com/"
                    >
                      个人中心
                    </a>
                  </a-menu-item>
                  <a-menu-item key="1">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="http://www.taobao.com/"
                    >
                      2nd menu item
                    </a>
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="3" @click="handleLogout"
                    >退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped lang="less">
.top-bar {
  width: 100%;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 9;
  background: #fff;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 8%);

  .breadcrumb-opt {
    min-height: 40px;
    padding: 0 20px;

    .ant-dropdown-link {
      display: block;
    }

    .user-avatar {
      width: 30px;
      height: 30px;
      border: 1px solid #f0f0f0;
      border-radius: 50%;
    }
  }
}
</style>

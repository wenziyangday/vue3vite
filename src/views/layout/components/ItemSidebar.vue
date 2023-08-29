<script setup lang="ts">
import VWIconFont from '@/components/icon-font/VWIconFont.vue';

const props = defineProps<ItemSidebarProps>();

interface ItemSidebarProps {
  children: any[] | undefined;
  pathCur?: string;
}

/**
 * 处理路径
 * */
const handleCurPath = (route: any): string => {
  const { pathCur } = props;

  // 处理首页路由跳转问题
  if (!route.path && route?.children?.length > 0) {
    return route.children?.[0].path;
  }

  if (pathCur) {
    return `${pathCur}/${route.path}`;
  }

  return route.path;
};
</script>

<template>
  <template v-for="item in children">
    <template v-if="!item.hidden">
      <a-menu-item
        v-if="(item.children ?? []).length === 0 || !item.path"
        :key="handleCurPath(item)"
      >
        <v-w-icon-font
          v-if="item.meta?.icon"
          :type="item.meta.icon"
          font-color="#ffffff"
        />
        <span v-if="item.path">{{ item?.meta?.title ?? '暂无' }}</span>
        <span v-else>{{ item?.children[0]['meta']['title'] ?? '暂无' }}</span>
      </a-menu-item>
      <template v-else>
        <a-sub-menu :key="handleCurPath(item)">
          <template #title>
            <span>
              <v-w-icon-font
                v-if="item.meta?.icon"
                :type="item.meta.icon"
                font-color="#ffffff"
              />
              <span>{{ item?.meta?.title ?? '暂无' }}</span>
            </span>
          </template>
          <item-sidebar
            :children="item.children"
            :path-cur="handleCurPath(item)"
          />
        </a-sub-menu>
      </template>
    </template>
  </template>
</template>

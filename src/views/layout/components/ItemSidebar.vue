<script setup lang="ts">
const props = defineProps<ItemSidebarProps>();

interface ItemSidebarProps {
  children: any[] | undefined;
  pathCur?: string;
}

/**
 * 处理路径
 * */
const handleCurPath = (path: string): string => {
  const { pathCur } = props;
  if (pathCur) {
    return pathCur + '/' + path;
  }

  return path;
};
</script>

<template>
  <template v-for="item in children">
    <template v-if="!item.hidden">
      <a-menu-item
        v-if="(item.children ?? []).length === 0"
        :key="handleCurPath(item.path)"
      >
        <span>{{ item?.meta?.title ?? '暂无' }}</span>
      </a-menu-item>
      <template v-else>
        <a-sub-menu :key="handleCurPath(item.path)">
          <template #title>
            <span>
              <span>{{ item?.meta?.title ?? '暂无' }}</span>
            </span>
          </template>
          <item-sidebar
            :children="item.children"
            :path-cur="handleCurPath(item.path)"
          />
        </a-sub-menu>
      </template>
    </template>
  </template>
</template>

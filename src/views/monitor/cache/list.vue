<script setup lang="ts">
import { message, type TableColumnsType } from 'ant-design-vue';
import { computed, ref } from 'vue';

import {
  clearCacheAll,
  clearCacheKey,
  clearCacheName,
  getCacheValue,
  listCacheKey,
  listCacheName
} from '@/apis/monitor/cache';
import ActionTable from '@/components/action-table/ActionTable.vue';
import VWIconFont from '@/components/icon-font/VWIconFont.vue';
import VWForm from '@/components/table/form/VWForm.vue';
import useTableRequest from '@/plugins/hooks/useTableRequest';
import { type IFormItem } from '@/types/opts';

/**
 * th 表头
 * */
const columns = ref<TableColumnsType[]>([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 60
  },
  {
    title: '缓存名称',
    dataIndex: 'cacheName',
    key: 'cacheName'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action'
  }
]);
const columnsGetters = computed(() =>
  columns.value.map((column) => ({
    ...column,
    align: 'center'
  }))
);

const cacheColumns = ref<TableColumnsType[]>([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 60
  },
  {
    title: '缓存名称',
    dataIndex: 'nowCacheName',
    key: 'nowCacheName'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action'
  }
]);
const cacheColumnsGetters = computed(() =>
  cacheColumns.value.map((column) => ({
    ...column,
    align: 'center'
  }))
);

const { dataSource, getList } = useTableRequest(listCacheName, 'data');
const cacheNames = ref<any[]>([]);
// form的初始化值
const cacheContentDefault = ref<any>({});
// 异步更新渲染表单
const showForm = ref<boolean>(true);
// 当前选中
const curRows = ref<any>({});
// 表格的行操作
const handleCustomRow = (record): any => {
  return {
    onClick: () => {
      const { cacheName, nowCacheName, originalVal } = record;
      if (cacheName) {
        curRows.value = record;
        listCacheKey(cacheName).then((res) => {
          cacheNames.value = res.data.map((data) => ({
            nowCacheName: data.replace(cacheName, ''),
            originalVal: data,
            cacheKey: cacheName
          }));
        });
      }

      if (nowCacheName && originalVal) {
        showForm.value = false;
        getCacheValue(nowCacheName, originalVal).then((res) => {
          cacheContentDefault.value = res.data;
          setTimeout(() => {
            showForm.value = true;
          }, 0);
        });
      }
    }
  };
};

// 新增数据结构
const defaultOptions: IFormItem[] = [
  {
    label: '缓存名称',
    name: 'cacheName',
    bisection: 1
  },
  {
    label: '缓存键名',
    name: 'cacheKey',
    bisection: 1
  },
  {
    label: '缓存内容',
    name: 'cacheValue',
    inputType: 'textarea',
    bisection: 1
  }
];
const options = ref<IFormItem[]>(defaultOptions);

// 删除列表缓存元素
const handleClearCacheName = async (record: unknown): void => {
  await clearCacheName(record.cacheName);
  await getList();
};

// 删除键名元素
const handleClearCacheKey = async (record: unknown): void => {
  await clearCacheKey(record.originalVal);
  const { cacheName } = curRows.value;
  if (cacheName) {
    handleCustomRow(curRows.value).onClick();
  }
};

// 缓存列表刷新
const handleRefresh = async (): void => {
  await getList();
  await message.success('刷新成功');
};

// 缓存键名刷新
const handleRefreshKeys = (): void => {
  if (Object.keys(curRows.value).length === 0) {
    return;
  }
  const { cacheName } = curRows.value;
  if (cacheName) {
    handleCustomRow(curRows.value).onClick();
    void message.success('刷新成功');
  }
};

// 清除全部
const handleClearAll = async (): void => {
  await clearCacheAll();
  window.location.href = '/';
};
</script>

<template>
  <a-row :gutter="[16, 16]">
    <a-col :span="8">
      <a-card>
        <template #cover>
          <div class="wrap-title">
            <div class="title">
              <v-w-icon-font type="CPU" />
              <span style="margin-left: 10px">缓存列表</span>
            </div>
            <div class="opt" @click="handleRefresh">
              <reload-outlined />
            </div>
          </div>
        </template>
        <div class="container">
          <a-table
            class="form-item-margin"
            :columns="columnsGetters"
            :data-source="dataSource"
            :pagination="false"
            :scroll="{ y: 500 }"
            :custom-row="handleCustomRow"
          >
            <template #bodyCell="{ column, index, text, record }">
              <template v-if="column.dataIndex === 'index'"
                >{{ index + 1 }}
              </template>
              <template v-if="column.dataIndex === 'cacheName'"
                >{{ text.replace(':', '') }}
              </template>
              <template v-if="column.dataIndex === 'action'">
                <action-table
                  btn-size="small"
                  btn-type="link"
                  :options="['delete']"
                  @click-cb="
                    () => {
                      handleClearCacheName(record);
                    }
                  "
                />
              </template>
            </template>
          </a-table>
        </div>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card>
        <template #cover>
          <div class="wrap-title">
            <div class="title">
              <v-w-icon-font type="CPU" />
              <span style="margin-left: 10px">键名列表</span>
            </div>
            <div class="opt" @click="handleRefreshKeys">
              <reload-outlined />
            </div>
          </div>
        </template>
        <div class="container">
          <a-table
            class="form-item-margin"
            :columns="cacheColumnsGetters"
            :data-source="cacheNames"
            :pagination="false"
            :scroll="{ y: 500 }"
            :custom-row="handleCustomRow"
          >
            <template #bodyCell="{ column, index, record }">
              <template v-if="column.dataIndex === 'index'"
                >{{ index + 1 }}
              </template>
              <template v-if="column.dataIndex === 'action'">
                <action-table
                  btn-size="small"
                  btn-type="link"
                  :options="['delete']"
                  @click-cb="
                    () => {
                      handleClearCacheKey(record);
                    }
                  "
                />
              </template>
            </template>
          </a-table>
        </div>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card>
        <template #cover>
          <div class="wrap-title">
            <div class="title">
              <v-w-icon-font type="CPU" />
              <span style="margin-left: 10px">缓存内容</span>
            </div>
            <div class="opt" @click="handleClearAll">
              <reload-outlined />
              清理全部
            </div>
          </div>
        </template>
        <div class="container" style="margin-top: 16px">
          <v-w-form
            v-if="showForm"
            :label-span="8"
            :options="options"
            :default-value="cacheContentDefault"
            layout="vertical"
          />
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<style scoped lang="less">
.wrap-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #f0f0f0;

  .title {
    display: flex;
    min-height: 54px;
    align-items: center;
    margin-bottom: -1px;
    font-size: 14px;
    font-weight: 600;
    color: rgb(0 0 0 / 88%);
    background: transparent;
    border-radius: 4px 4px 0 0;
  }

  .opt {
    font-size: 12px;
    color: @blue;
    cursor: pointer;
  }
}

.container {
  min-height: 70vh;
}
</style>

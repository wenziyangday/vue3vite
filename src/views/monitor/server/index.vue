<script setup lang="ts">
import { type TableColumnsType } from 'ant-design-vue';
import { computed, ref } from 'vue';

import { getServer } from '@/apis/monitor/server';
import VWIconFont from '@/components/icon-font/VWIconFont.vue';
import useTableRequest from '@/plugins/hooks/useTableRequest';

const { dataSource, getList } = useTableRequest(getServer, 'data');
/**
 * th 表头
 * */
const columns = ref<TableColumnsType[]>([
  {
    title: '盘符路径',
    dataIndex: 'dirName',
    key: 'dirName'
  },
  {
    title: '文件系统',
    dataIndex: 'sysTypeName',
    key: 'sysTypeName'
  },
  {
    title: '盘符类型',
    dataIndex: 'typeName',
    key: 'typeName'
  },
  {
    title: '总大小',
    dataIndex: 'total',
    key: 'total'
  },
  {
    title: '可用大小',
    dataIndex: 'free',
    key: 'free'
  },
  {
    title: '已用大小',
    dataIndex: 'used',
    key: 'used'
  },
  {
    title: '已用百分比',
    dataIndex: 'usage',
    key: 'usage'
  }
]);
const columnsGetters = computed(() =>
  columns.value.map((column) => ({
    ...column,
    align: 'left'
  }))
);
</script>

<template>
  <a-row :gutter="[16, 16]">
    <a-col :span="12">
      <a-card>
        <template #cover>
          <div class="title">
            <v-w-icon-font type="CPU" />
            <span style="margin-left: 10px">CPU</span>
          </div>
        </template>
        <a-row :gutter="[16, 16]" class="row-bottom">
          <a-col :span="12">属性</a-col>
          <a-col :span="12">值</a-col>
          <a-col :span="12">核心数</a-col>
          <a-col :span="12">{{ dataSource?.cpu?.cpuNum }}</a-col>
          <a-col :span="12">用户使用率</a-col>
          <a-col :span="12">{{ dataSource?.cpu?.used }}%</a-col>
          <a-col :span="12">系统使用率</a-col>
          <a-col :span="12">{{ dataSource?.cpu?.sys }}%</a-col>
          <a-col :span="12">当前空闲率</a-col>
          <a-col :span="12">{{ dataSource?.cpu?.free }}%</a-col>
        </a-row>
      </a-card>
    </a-col>
    <a-col :span="12">
      <a-card>
        <template #cover>
          <div class="title">
            <v-w-icon-font type="memory" />
            <span style="margin-left: 10px"> 内存 </span>
          </div>
        </template>
        <a-row :gutter="[16, 16]" class="row-bottom">
          <a-col :span="8">属性</a-col>
          <a-col :span="8">内存</a-col>
          <a-col :span="8">JVM</a-col>
          <a-col :span="8">总内存</a-col>
          <a-col :span="8">{{ dataSource?.mem?.total }}G</a-col>
          <a-col :span="8">{{ dataSource?.jvm?.total }}M</a-col>
          <a-col :span="8">已用内存</a-col>
          <a-col :span="8">{{ dataSource?.mem?.used }}G</a-col>
          <a-col :span="8">{{ dataSource?.jvm?.used }}M</a-col>
          <a-col :span="8">剩余内存</a-col>
          <a-col :span="8">{{ dataSource?.mem?.free }}G</a-col>
          <a-col :span="8">{{ dataSource?.jvm?.free }}M</a-col>
          <a-col :span="8">使用率</a-col>
          <a-col
            :span="8"
            :class="{ 'text-danger': dataSource?.mem?.usage > 80 }"
            >{{ dataSource?.mem?.usage }}%
          </a-col>
          <a-col
            :span="8"
            :class="{ 'text-danger': dataSource?.jvm?.usage > 80 }"
            >{{ dataSource?.jvm?.usage }}%
          </a-col>
        </a-row>
      </a-card>
    </a-col>
    <a-col :span="24">
      <a-card>
        <template #cover>
          <div class="title">
            <v-w-icon-font type="sever" />
            <span style="margin-left: 10px">服务器信息</span>
          </div>
        </template>
        <a-row :gutter="16" class="row-bottom">
          <a-col :span="3">服务器名称</a-col>
          <a-col :span="6">{{ dataSource?.sys?.computerName }}</a-col>
          <a-col :span="3">操作系统</a-col>
          <a-col :span="6">{{ dataSource?.sys?.osName }}</a-col>
        </a-row>
        <a-row :gutter="16" class="row-bottom">
          <a-col :span="3">服务器IP</a-col>
          <a-col :span="6">{{ dataSource?.sys?.computerIp }}</a-col>
          <a-col :span="3">系统架构</a-col>
          <a-col :span="6">{{ dataSource?.sys?.osArch }}</a-col>
        </a-row>
      </a-card>
    </a-col>
    <a-col :span="24">
      <a-card>
        <template #cover>
          <div class="title">
            <v-w-icon-font type="java" />
            <span style="margin-left: 10px">Java虚拟机信息</span>
          </div>
        </template>
        <a-row :gutter="16" class="row-bottom">
          <a-col :span="3">Java名称</a-col>
          <a-col :span="6">{{ dataSource?.jvm?.name }}</a-col>
          <a-col :span="3">Java版本</a-col>
          <a-col :span="6">{{ dataSource?.jvm?.version }}</a-col>
        </a-row>
        <a-row :gutter="16" class="row-bottom">
          <a-col :span="3">启动时间</a-col>
          <a-col :span="6">{{ dataSource?.jvm?.startTime }}</a-col>
          <a-col :span="3">运行时长</a-col>
          <a-col :span="6">{{ dataSource?.jvm?.runTime }}</a-col>
        </a-row>
        <a-row :gutter="16" class="row-bottom">
          <a-col :span="3">安装路径</a-col>
          <a-col :span="21">{{ dataSource?.jvm?.home }}</a-col>
        </a-row>
        <a-row :gutter="16" class="row-bottom">
          <a-col :span="3">项目路径</a-col>
          <a-col :span="21">{{ dataSource?.sys?.userDir }}</a-col>
        </a-row>
        <a-row :gutter="16" class="row-bottom">
          <a-col :span="3">运行参数</a-col>
          <a-col :span="21">{{ dataSource?.jvm?.inputArgs }}</a-col>
        </a-row>
      </a-card>
    </a-col>
    <a-col :span="24">
      <a-card>
        <template #cover>
          <div class="title">
            <v-w-icon-font type="disk-drive" />
            <span style="margin-left: 10px">磁盘状态</span>
          </div>
        </template>
        <a-table
          :dataSource="dataSource.sysFiles"
          :columns="columnsGetters"
          :pagination="false"
        >
          <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'usage'">{{ text }}%</template>
          </template>
        </a-table>
      </a-card>
    </a-col>
  </a-row>
</template>

<style lang="less" scoped>
.title {
  display: flex;
  min-height: 54px;
  align-items: center;
  padding: 0 24px;
  margin-bottom: -1px;
  font-size: 14px;
  font-weight: 600;
  color: rgb(0 0 0 / 88%);
  background: transparent;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 4px 4px 0 0;
}

.row-bottom {
  margin-bottom: 16px;
}

.text-danger {
  color: red;
}
</style>

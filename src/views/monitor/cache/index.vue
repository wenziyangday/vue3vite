<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { getCache } from '@/apis/monitor/cache';
import VWEcharts from '@/components/echarts/VWEcharts.vue';
import VWIconFont from '@/components/icon-font/VWIconFont.vue';

// 控制异步数据显隐
const showRef = ref<boolean>(false);
// 内存使用情况
const chartsOption = ref<any>({});
// 命令使用情况
const orderChartsOptions = ref<any>({});
const dataSource = ref<any>({});

onMounted(() => {
  getCache().then((res) => {
    dataSource.value = res.data;
    const { info, commandStats } = res.data;
    orderChartsOptions.value = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      series: [
        {
          name: '命令',
          type: 'pie',
          roseType: 'radius',
          radius: [40, 168],
          center: ['50%', '50%'],
          data: commandStats,
          animationEasing: 'cubicInOut',
          animationDuration: 1000
        }
      ]
    };
    chartsOption.value = {
      tooltip: {
        formatter: `{b} <br/>{a} : ${info.used_memory_human}`
      },
      series: [
        {
          name: '峰值',
          type: 'gauge',
          min: 0,
          max: 1000,
          detail: {
            formatter: info.used_memory_human
          },
          data: [
            {
              value: parseFloat(info.used_memory_human),
              name: '内存消耗'
            }
          ]
        }
      ]
    };
    setTimeout(() => {
      showRef.value = true;
    }, 0);
  });
});
</script>

<template>
  <a-row :gutter="[16, 16]">
    <a-col :span="24">
      <a-card>
        <template #cover>
          <div class="title">
            <v-w-icon-font type="CPU" />
            <span style="margin-left: 10px">基本信息</span>
          </div>
        </template>
        <a-row :gutter="[16, 16]" class="row-bottom">
          <a-col :span="3">Redis版本</a-col>
          <a-col :span="3">{{ dataSource?.info?.redis_version }}</a-col>
          <a-col :span="3">运行模式</a-col>
          <a-col :span="3"
            >{{
              dataSource?.info?.redis_mode === 'standalone' ? '单机' : '集群'
            }}
          </a-col>
          <a-col :span="3">端口</a-col>
          <a-col :span="3">{{ dataSource?.info?.tcp_port }}</a-col>
          <a-col :span="3">客户端数</a-col>
          <a-col :span="3">{{ dataSource?.info?.connected_clients }}</a-col>
          <a-col :span="3">运行时间(天)</a-col>
          <a-col :span="3">{{ dataSource?.info?.uptime_in_days }}</a-col>
          <a-col :span="3">使用内存</a-col>
          <a-col :span="3">{{ dataSource?.info?.used_memory_human }}</a-col>
          <a-col :span="3">使用CPU</a-col>
          <a-col :span="3"
            >{{ dataSource?.info?.used_cpu_user_children }}
          </a-col>
          <a-col :span="3">内存配置</a-col>
          <a-col :span="3">{{ dataSource?.info?.maxmemory_human }}</a-col>
          <a-col :span="3">AOF是否开启</a-col>
          <a-col :span="3"
            >{{ dataSource?.info?.aof_enabled === '0' ? '否' : '是' }}
          </a-col>
          <a-col :span="3">RDB是否成功</a-col>
          <a-col :span="3"
            >{{ dataSource?.info?.rdb_last_bgsave_status }}
          </a-col>
          <a-col :span="3">Key数量</a-col>
          <a-col :span="3">{{ dataSource?.dbSize }}</a-col>
          <a-col :span="3">网络入口/出口</a-col>
          <a-col :span="3"
            >{{ dataSource?.info?.instantaneous_input_kbps }}
          </a-col>
        </a-row>
      </a-card>
    </a-col>
    <a-col :span="12">
      <a-card>
        <template #cover>
          <div class="title">
            <v-w-icon-font type="memory" />
            <span style="margin-left: 10px"> 命令统计 </span>
          </div>
        </template>
        <div class="order-static" id="order-container" v-if="showRef">
          <v-w-echarts
            echarts-id="order-container"
            :options="orderChartsOptions"
          />
        </div>
      </a-card>
    </a-col>
    <a-col :span="12">
      <a-card>
        <template #cover>
          <div class="title">
            <v-w-icon-font type="memory" />
            <span style="margin-left: 10px"> 内存信息 </span>
          </div>
        </template>
        <div class="order-static" v-if="showRef">
          <v-w-echarts echarts-id="memory-container" :options="chartsOption" />
        </div>
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
  color: @red;
}

.order-static {
  width: 100%;
  height: 400px;
}
</style>

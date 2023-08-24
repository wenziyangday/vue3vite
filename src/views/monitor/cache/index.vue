<script setup lang="ts">
import * as echarts from 'echarts';
import { computed, onMounted, ref } from 'vue';

import { getCache } from '@/apis/monitor/cache';
import VWIconFont from '@/components/icon-font/VWIconFont.vue';
import useTableRequest from '@/plugins/hooks/useTableRequest';

const { dataSource, getList } = useTableRequest(getCache, 'data');

const memoryOptions = computed(() => {
  return {
    tooltip: {
      formatter: `{b} <br/>{a} : ${dataSource.value?.info.used_memory_human}`
    },
    series: [
      {
        name: '峰值',
        type: 'gauge',
        min: 0,
        max: 1000,
        detail: {
          formatter: dataSource.value?.info.used_memory_human
        },
        data: [
          {
            value: parseFloat(dataSource.value?.info.used_memory_human),
            name: '内存消耗'
          }
        ]
      }
    ]
  };
});

const orderEcharts = ref<any>();
const memoryEcharts = ref<any>();

onMounted(() => {
  const dataSource = {
    commandStats: [
      {
        name: 'set',
        value: '235'
      },
      {
        name: 'del',
        value: '183'
      },
      {
        name: 'info',
        value: '119'
      },
      {
        name: 'exists',
        value: '138'
      },
      {
        name: 'get',
        value: '15170'
      },
      {
        name: 'dbsize',
        value: '59'
      },
      {
        name: 'setex',
        value: '827'
      },
      {
        name: 'keys',
        value: '42'
      },
      {
        name: 'hello',
        value: '1'
      }
    ],
    info: {
      used_memory_dataset_perc: '86.82%',
      aof_current_rewrite_time_sec: '-1',
      used_memory_peak_perc: '98.54%',
      rss_overhead_ratio: '1.02',
      db0: 'keys=23,expires=1,avg_ttl=1335700',
      active_defrag_hits: '0',
      atomicvar_api: 'c11-builtin',
      rss_overhead_bytes: '37888',
      gcc_version: '4.2.1',
      keyspace_misses: '620',
      redis_git_dirty: '0',
      connected_clients: '1',
      master_repl_offset: '0',
      repl_backlog_active: '0',
      rdb_changes_since_last_save: '4',
      client_recent_max_output_buffer: '0',
      rejected_connections: '0',
      io_threads_active: '0',
      unexpected_error_replies: '0',
      run_id: '1c5f209b6daf72d851f1be094cf6f1014a98e37d',
      maxmemory: '0',
      mem_allocator: 'libc',
      used_cpu_sys: '445.683555',
      expired_stale_perc: '0.00',
      blocked_clients: '0',
      total_commands_processed: '16773',
      sync_partial_err: '0',
      current_save_keys_total: '0',
      total_connections_received: '1',
      evicted_keys: '0',
      maxmemory_policy: 'noeviction',
      config_file: '/usr/local/etc/redis.conf',
      used_memory_human: '1.12M',
      allocator_rss_ratio: '1.00',
      role: 'master',
      connected_slaves: '0',
      process_supervised: 'no',
      aof_last_cow_size: '0',
      used_memory_rss_human: '1.62M',
      cluster_enabled: '0',
      allocator_rss_bytes: '0',
      mem_fragmentation_ratio: '1.54',
      used_memory_scripts: '0',
      repl_backlog_size: '1048576',
      uptime_in_days: '27',
      used_memory_peak: '1187280',
      number_of_cached_scripts: '0',
      mem_fragmentation_bytes: '597488',
      used_memory_startup: '1028320',
      total_system_memory_human: '16.00G',
      hz: '10',
      used_memory_lua_human: '37.00K',
      instantaneous_input_kbps: '0.08',
      used_memory_scripts_human: '0B',
      rdb_bgsave_in_progress: '0',
      total_net_output_bytes: '16458303',
      uptime_in_seconds: '2363142',
      mem_clients_normal: '17440',
      total_forks: '184',
      slave_expires_tracked_keys: '0',
      current_fork_perc: '0.00',
      master_replid2: '0000000000000000000000000000000000000000',
      total_net_input_bytes: '1962807',
      instantaneous_output_kbps: '1.66',
      expired_keys: '152',
      allocator_frag_ratio: '1.51',
      aof_last_write_status: 'ok',
      redis_version: '6.2.6',
      allocator_frag_bytes: '559600',
      maxmemory_human: '0B',
      rdb_last_save_time: '1692605075',
      lazyfree_pending_objects: '0',
      aof_rewrite_scheduled: '0',
      migrate_cached_sockets: '0',
      keyspace_hits: '14688',
      allocator_allocated: '1102352',
      used_memory: '1169952',
      mem_replication_backlog: '0',
      used_memory_dataset: '122960',
      pubsub_patterns: '0',
      used_cpu_user_children: '0.200352',
      master_replid: '228b59c9914eed36fe29202b4727ed893b06953a',
      mem_aof_buffer: '0',
      total_error_replies: '0',
      rdb_last_bgsave_status: 'ok',
      redis_mode: 'standalone',
      total_writes_processed: '14837',
      allocator_resident: '1661952',
      allocator_active: '1661952',
      current_cow_size_age: '0',
      current_save_keys_processed: '0',
      expired_time_cap_reached_count: '0',
      sync_full: '0',
      rdb_current_bgsave_time_sec: '-1',
      aof_rewrite_in_progress: '0',
      multiplexing_api: 'kqueue',
      module_fork_in_progress: '0',
      tracking_clients: '0',
      rdb_last_cow_size: '0',
      mem_not_counted_for_evict: '0',
      dump_payload_sanitizations: '0',
      redis_git_sha1: '00000000',
      tracking_total_keys: '0',
      maxclients: '10000',
      clients_in_timeout_table: '0',
      latest_fork_usec: '18554',
      rdb_last_bgsave_time_sec: '0',
      os: 'Darwin 21.3.0 x86_64',
      used_cpu_sys_children: '1.395153',
      sync_partial_ok: '0',
      module_fork_last_cow_size: '0',
      arch_bits: '64',
      used_memory_lua: '37888',
      mem_clients_slaves: '0',
      tracking_total_items: '0',
      lazyfreed_objects: '0',
      process_id: '42855',
      tracking_total_prefixes: '0',
      total_system_memory: '17179869184',
      master_failover_state: 'no-failover',
      repl_backlog_histlen: '0',
      executable: '/usr/local/opt/redis/bin/redis-server',
      used_memory_rss: '1699840',
      loading: '0',
      active_defrag_running: '0',
      used_memory_peak_human: '1.13M',
      aof_enabled: '0',
      io_threaded_reads_processed: '0',
      total_reads_processed: '14838',
      second_repl_offset: '-1',
      active_defrag_misses: '0',
      configured_hz: '10',
      active_defrag_key_hits: '0',
      used_cpu_user: '482.068287',
      io_threaded_writes_processed: '0',
      redis_build_id: 'c6f3693d1aced7d9',
      cluster_connections: '0',
      aof_last_bgrewrite_status: 'ok',
      client_recent_max_input_buffer: '32',
      active_defrag_key_misses: '0',
      instantaneous_ops_per_sec: '1',
      repl_backlog_first_byte_offset: '0',
      expire_cycle_cpu_milliseconds: '1106443',
      current_cow_size: '0',
      tcp_port: '6379',
      pubsub_channels: '0',
      server_time_usec: '1692607777410400',
      lru_clock: '14886177',
      aof_last_rewrite_time_sec: '-1',
      used_memory_overhead: '1046992'
    },
    dbSize: 23
  };
  orderEcharts.value = echarts.init(
    document.getElementById('order-container'),
    'macarons'
  );
  orderEcharts.value?.setOption({
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
        data: [
          {
            name: 'set',
            value: '235'
          },
          {
            name: 'del',
            value: '183'
          },
          {
            name: 'info',
            value: '89'
          },
          {
            name: 'exists',
            value: '138'
          },
          {
            name: 'get',
            value: '15149'
          },
          {
            name: 'dbsize',
            value: '44'
          },
          {
            name: 'setex',
            value: '827'
          },
          {
            name: 'keys',
            value: '42'
          },
          {
            name: 'hello',
            value: '1'
          }
        ],
        animationEasing: 'cubicInOut',
        animationDuration: 1000
      }
    ]
  });

  memoryEcharts.value = echarts.init(
    document.getElementById('memory-container'),
    'macarons'
  );
  memoryEcharts.value?.setOption({
    tooltip: {
      formatter: `{b} <br/>{a} : ${dataSource.info.used_memory_human}`
    },
    series: [
      {
        name: '峰值',
        type: 'gauge',
        min: 0,
        max: 1000,
        detail: {
          formatter: dataSource.info.used_memory_human
        },
        data: [
          {
            value: parseFloat(dataSource.info.used_memory_human),
            name: '内存消耗'
          }
        ]
      }
    ]
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
        <div class="order-static" id="order-container">
          <!--          <v-w-echarts echarts-id="order-container" ref="orderEcharts" />-->
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
        <div class="order-static" id="memory-container">
          <!--          <v-w-echarts echarts-id="memory-container" :options="memoryOptions" />-->
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

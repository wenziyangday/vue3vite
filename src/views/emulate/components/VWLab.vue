<script lang="ts" setup>
import dayjs, { type Dayjs } from 'dayjs';
import { reactive, ref } from 'vue';

const symbolRef = ref<symbol>(Symbol('1212'));
const symbolDRef = reactive<Record<symbol, any>>({});
const dateFormat = 'YYYY/MM/DD';
const weekFormat = 'MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

const customWeekStartEndFormat = (value): void =>
  `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
    .endOf('week')
    .format(weekFormat)}`;
const value1 = ref<Dayjs>(dayjs('2015/01/01', dateFormat));
const value2 = ref<Dayjs>(dayjs('01/01/2015', dateFormatList[0]));
const value3 = ref<Dayjs>(dayjs('2015/01', monthFormat));
const value4 = ref<[Dayjs, Dayjs]>([
  dayjs('2015/01/01', dateFormat),
  dayjs('2015/01/01', dateFormat)
]);
const value5 = ref<Dayjs>(dayjs('2015/01/01', dateFormat));
const value6 = ref<Dayjs>(dayjs());
const value7 = ref<Dayjs>(dayjs());
const customFormat = (value): void =>
  `custom format: ${value.format(dateFormat)}`;
</script>

<template>
  {{ symbolRef }} {{ symbolDRef }}
  <a-space direction="vertical" :size="12">
    {{ value1 }}
    <a-date-picker v-model:value="value1" :format="dateFormat" />
    {{ value2 }}
    <a-date-picker v-model:value="value2" :format="dateFormatList" />
    {{ value3 }}
    <a-date-picker
      v-model:value="value3"
      :format="monthFormat"
      picker="month"
    />
    {{ value4 }}
    <a-range-picker v-model:value="value4" :format="dateFormat" />
    {{ value5 }}
    <a-date-picker v-model:value="value5" :format="customFormat" />
    {{ value6 }}
    <a-date-picker
      v-model:value="value6"
      :format="customWeekStartEndFormat"
      picker="week"
    />
    {{ value7 }}
    <a-date-picker v-model:value="value7" />
  </a-space>

  <a-form :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
    <a-form-item label="张三" name="123">
      <div style="background: red">李四</div>
    </a-form-item>
    <a-form-item label="张三">
      <div style="background: red">李四</div>
    </a-form-item>
    <a-form-item label="张三">
      <div style="background: red">李四</div>
    </a-form-item>
    <a-form-item label="张三">
      <div style="background: red">李四</div>
    </a-form-item>
  </a-form>
  <a-divider></a-divider>
  <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
    <a-row>
      <a-col :span="8" v-for="i in 10" :key="i">
        <a-form-item label="张三" class="mb">
          <div style="background: red">李四</div>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          label="张三"
          class="mb"
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 22 }"
        >
          <div style="background: red">李四</div>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<style lang="less" scoped>
.mb {
  margin-bottom: 0;
}
</style>

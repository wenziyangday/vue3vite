import { onMounted, ref } from 'vue';

import { handleTree } from '@/utils/tools';

const useTableRequest = function (
  requestCb?: Promise,
  listKey?: string,
  defaultParams?: unknown,
  isUnMounted?: boolean,
  isNotUsePagination?: boolean,
  needTree?: Record<string, unknown>
): unknown {
  if (!listKey) {
    listKey = 'rows';
  }

  if (!defaultParams) {
    defaultParams = {};
  }

  // 是否初始化 mounted
  isUnMounted = !isUnMounted;

  // 网络请求响应数据
  const dataSource: [] = ref([]);
  // 原始数据  网络请求响应数据
  const originalData: [] = ref([]);
  // 表格多选勾选项
  const rowKeys = ref<string | number[]>([]);
  // 分页控制器数据项
  let defaultPaginationIndicator = {};
  if (!isNotUsePagination) {
    defaultPaginationIndicator = {
      current: 1,
      defaultPageSize: 10,
      total: 0
    };
  }
  const paginationIndicator = ref<Record<string, any>>(
    defaultPaginationIndicator
  );
  const sorterIndicator = ref<Record<string, any>>({});

  // 多选处理方法
  const handleChangeSelection = (selectedRowKeys: string | number[]): void => {
    rowKeys.value = selectedRowKeys;
  };

  // 检索条件 接收响应式的form 表单
  const formStatus = ref<unknown>({});
  /**
   * 获取列表
   * */
  const getList = (): void => {
    const {
      value: { current: pageNum, pageSize, defaultPageSize }
    } = paginationIndicator;
    const params = {
      ...formStatus.value,
      ...defaultParams
    };

    // 页码控制
    if (!isNotUsePagination) {
      params.pageNum = pageNum;
      params.pageSize = pageSize ?? defaultPageSize;
    }

    // 排序控制
    if (Object.keys(sorterIndicator.value).length > 0) {
      const { column, order } = sorterIndicator.value;
      if (column) {
        params.orderByColumn = column.dataIndex;
      } else {
        delete params.orderByColumn;
      }

      if (order) {
        params.isAsc = `${order}ing`;
      } else {
        delete params.isAsc;
      }
    }

    requestCb(params).then((res) => {
      if (needTree) {
        dataSource.value = handleTree(res[listKey], needTree.value);
      } else {
        dataSource.value = res[listKey];
      }
      originalData.value = res[listKey];
      paginationIndicator.value.total = res.total;
    });
  };

  // 分页控制器处理方法及回调
  const handleChange = (pagination, filters, sorter): void => {
    paginationIndicator.value = pagination;
    sorterIndicator.value = sorter;
    getList();
  };

  // 搜索回调
  const searchCb = (formState: unknown): void => {
    formStatus.value = formState;
    getList();
  };

  onMounted(() => {
    isUnMounted && requestCb && getList();
  });

  return {
    dataSource,
    rowKeys,
    formStatus,
    paginationIndicator,
    originalData,
    searchCb,
    handleChangeSelection,
    handleChange,
    getList
  };
};

export default useTableRequest;

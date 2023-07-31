import { onMounted, ref } from 'vue';

const useTableRequest = function (
  requestCb?: Promise,
  listKey?: string
): unknown {
  if (!listKey) {
    listKey = 'rows';
  }
  // 网络请求响应数据
  const dataSource: [] = ref([]);
  // 表格多选勾选项
  const rowKeys = ref<string | number[]>([]);
  // 分页控制器数据项
  const paginationIndicator = ref({
    current: 1,
    defaultPageSize: 10,
    total: 0
  });

  // 多选处理方法
  const handleChangeSelection = (selectedRowKeys: string | number[]): void => {
    rowKeys.value = selectedRowKeys;
  };

  // 检索条件
  const formStatus = ref<unknown>({});
  /**
   * 获取列表
   * */
  const getList = (): void => {
    const {
      value: { current: pageNum, defaultPageSize: pageSize }
    } = paginationIndicator;
    requestCb({
      pageNum,
      pageSize,
      ...formStatus.value
    }).then((res) => {
      dataSource.value = res[listKey];
      paginationIndicator.value.total = res.total;
    });
  };

  // 分页控制器处理方法及回调
  const handleChange = (pagination): void => {
    paginationIndicator.value = pagination;
    getList();
  };

  // 搜索回调
  const searchCb = (formState: unknown): void => {
    formStatus.value = formState;
    getList();
  };

  onMounted(() => {
    requestCb && getList();
  });

  return {
    dataSource,
    rowKeys,
    formStatus,
    paginationIndicator,
    searchCb,
    handleChangeSelection,
    handleChange,
    getList
  };
};

export default useTableRequest;

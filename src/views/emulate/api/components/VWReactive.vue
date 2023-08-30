<script setup lang="ts">
import { message } from 'ant-design-vue';
import {
  customRef,
  isReactive,
  reactive,
  readonly,
  type Ref,
  ref,
  shallowReactive,
  shallowRef,
  toRaw,
  triggerRef
} from 'vue';

/**
 * ref begin
 * */
const basicData = ref<number>(0);
const handleBasicData = (): void => {
  basicData.value += 1;
};

const complexData = ref<any>({ count: 0 });
const handleComplexData = (): void => {
  let { count } = complexData.value;
  count++;
  complexData.value.count = count;
};

const complexDataWhole = ref<any>({ count: 0 });
const handleComplexDataWhole = (): void => {
  complexDataWhole.value = { count: Math.random() * 100 };
};

const basicDataShallow = shallowRef<number>(0);
const handleBasicDataShallow = (): void => {
  basicDataShallow.value += 1;
};

const complexDataShallow = shallowRef<any>({ count: 0 });
const handleComplexDataShallow = (): void => {
  let { count } = complexDataShallow.value;
  count++;
  complexDataShallow.value.count = count;
  void message.warn('局部操作shallowRef（引用类型）的值，不会触发页面响应式');
};

const complexDataWholeShallow = shallowRef<any>({ count: 0 });
const handleComplexDataWholeShallow = (): void => {
  complexDataWholeShallow.value = { count: Math.random() * 100 };
};

const complexDataTriggerRef = shallowRef({ count: 0 });
const handleForceTriggerRef = (): void => {
  complexDataTriggerRef.value.count = Math.random();
  triggerRef(complexDataTriggerRef);
};

const useCustomRef = (valueName): Ref => {
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        // console.log(track, 'CustomRef');
        return valueName;
      },
      set(value) {
        valueName = value;
        // console.log(trigger, 'CustomRef');
        trigger();
      }
    };
  });
};
const complexDataCustomRef = useCustomRef('CustomRef');
const handleComplexDataCustomRef = (): void => {
  complexDataCustomRef.value = Math.random();
};
const useDebounceRef = (valueName): Ref => {
  let timeout;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return valueName;
      },
      set(value) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          valueName = value;
          trigger();
        }, 500);
      }
    };
  });
};
const debounceVal = useDebounceRef('text');
/**
 * ref end
 * */

/**
 * reactive begin
 * */
const complexDataReactive = reactive<any>({ count: 0 });
const handleComplexDataReactive = (): void => {
  complexDataReactive.count = Math.random() * 100;
};

let complexDataWholeReactive = reactive<any>({ count: 0 });
const handleComplexDataWholeReactive = (): void => {
  complexDataWholeReactive = { count: Math.random() * 100 };
  void message.warn('整体替换reactive引用类型的数据会引发响应式丢失');
};

const complexShallowReactive = shallowReactive<any>({
  count: 0,
  nested: {
    name: '嵌套name'
  }
});
const handleComplexShallowReactive = (): void => {
  complexShallowReactive.count = Math.random();
};
const handleComplexNestShallowReactive = (): void => {
  complexShallowReactive.nested.name = Math.random();
  void message.warn(
    '对于shallowReactive 里面 手动修改非根级的数据，不会引发页面渲染，但是当对象中的其他的响应式数据渲染页面时，数据仍然会更新'
  );
};
/**
 * reactive end
 * */

/**
 * readonly begin
 * */
const complex = reactive({ count: 0 });
const readonlyComplex = readonly(complex);
const handleComplex = (): void => {
  complex.count = Math.random();
};
const handleReadonlyComplex = (): void => {
  // readonlyComplex.count = Math.random();
  void message.warn('直接修改readonly的属性值，会报错');
};
/**
 * readonly end
 * */

/**
 * toRaw() begin
 * */
const reactiveRawData = reactive<any>({ count: 0 });
const toRawReactiveRawData = toRaw(reactiveRawData);

const handleReactiveRawData = (): void => {
  reactiveRawData.count = Math.random();
};

const handleToRawReactiveRawData = (): void => {
  void message.warn(
    `toRaw()之后并不是一个响应式的数据：${isReactive(toRawReactiveRawData)}`
  );
};
/**
 * toRaw() end
 * */
</script>

<template>
  <h4 class="v-w-item">
    ref: 接收一个值（基础类型数据、引用类型数据），返回一个响应式对象
  </h4>
  <a-space class="common-margin">
    <a-button size="small" @click="handleBasicData">
      基本数据类型{{ basicData }}
    </a-button>
    <a-button size="small" @click="handleComplexData">
      引用数据类型--局部修改{{ complexData }}
    </a-button>
    <a-button size="small" @click="handleComplexDataWhole">
      引用数据类型--整体替换{{ complexDataWhole }}
    </a-button>
  </a-space>

  <h6 class="desc-margin">
    shallowRef: ref()浅层作用形式， 浅层 ref
    的内部值将会原样存储和暴露，并且不会被深层递归地转为响应式（等价于ref对于引用数据类型的响应式是进行深层递归操作的）。<br />只有对
    .value 的访问是响应式的（整体操作才会具有响应式）
  </h6>
  <div class="comment-margin">
    <span>应用场景：</span>
    <div class="comment-desc">
      对于第一层数据变化引发页面渲染的数据可以使用，从而降低了 对数据的递归操作
    </div>
  </div>
  <a-space class="common-margin">
    <a-button size="small" @click="handleBasicDataShallow">
      基本数据类型{{ basicDataShallow }}
    </a-button>
    <a-button size="small" @click="handleComplexDataShallow">
      引用数据类型--局部修改{{ complexDataShallow }}
    </a-button>
    <a-button size="small" @click="handleComplexDataWholeShallow">
      引用数据类型--整体替换{{ complexDataWholeShallow }}
    </a-button>
  </a-space>

  <h6 class="desc-margin">
    triggerRef: 强制触发依赖于一个浅层 ref(shallowRef)
    的副作用，这通常在对浅引用的内部值进行深度变更后使用
  </h6>
  <a-space class="common-margin">
    <a-button size="small" @click="handleForceTriggerRef">
      引用数据类型--局部修改{{ complexDataTriggerRef }}
    </a-button>
  </a-space>

  <h6 class="desc-margin">
    customRef: 创建一个自定义的 ref，显式声明对其依赖追踪和更新触发的控制方式。
  </h6>
  <div class="comment-margin">
    <span>说明：</span>
    <div class="comment-desc">
      customRef() 预期接收一个工厂函数作为参数，这个工厂函数接受 track 和
      trigger 两个函数作为参数，并返回一个带有 get 和 set 方法的对象。 <br />
      一般来说，track()（() => trackRefValue(this)） 应该在
      get()方法中调用（没有调用track，是无法触发响应的），而 trigger()（() =>
      triggerRefValue(this)） 应该在 set()
      中调用（trigger，也是无法触发响应的）。
      <br />然而事实上，你对何时调用、是否应该调用他们有完全的控制权。
    </div>
  </div>
  <a-space class="common-margin">
    <a-button size="small" @click="handleComplexDataCustomRef">
      引用数据类型--局部修改{{ complexDataCustomRef }}
    </a-button>
    <div>
      debounce数据（对于ant框架中的a-input 似乎(与预想的不一样)）：
      {{ debounceVal }}<input v-model="debounceVal" />
      <!--      {{ debounceVal }}-->
      <!--      <a-input v-model:value="debounceVal"></a-input>-->
    </div>
  </a-space>
  <a-divider></a-divider>

  <h4 class="v-w-item">reactive: 返回一个对象（引用数据类型）的响应式代理</h4>
  <a-space class="common-margin">
    <a-button size="small" @click="handleComplexDataReactive">
      引用数据类型--局部修改{{ complexDataReactive }}
    </a-button>
    <a-button size="small" @click="handleComplexDataWholeReactive">
      引用数据类型--整体替换{{ complexDataWholeReactive }}
    </a-button>
  </a-space>

  <h6 class="desc-margin">
    shallowReactive: reactive()浅层作用形式，<br />
    和 reactive()
    不同，这里没有深层级的转换：一个浅层响应式对象里只有根级别的属性是响应式的。属性的值会被原样存储和暴露，这也意味着值为
    ref 的属性不会被自动解包了。
  </h6>
  <a-space class="common-margin">
    <a-button size="small" @click="handleComplexShallowReactive">
      引用数据类型--{{ complexShallowReactive }}
    </a-button>
    <a-button size="small" @click="handleComplexNestShallowReactive">
      引用数据类型--深层嵌套{{ complexShallowReactive }}
    </a-button>
  </a-space>
  <a-divider></a-divider>

  <h4 class="v-w-item">
    readonly: 接受一个对象 (不论是响应式还是普通的) 或是一个
    ref，返回一个原值的只读代理。
  </h4>
  <div class="comment-margin">
    <span>说明：</span>
    <div class="comment-desc">
      只读代理是深层的：对任何嵌套属性的访问都将是只读的。<br />它的 ref
      解包行为与 reactive() 相同，但解包得到的值是只读的。
    </div>
  </div>
  <a-space class="common-margin">
    <a-button size="small" @click="handleComplex">
      引用数据类型--{{ complex }}
    </a-button>
    <a-button size="small" @click="handleReadonlyComplex">
      引用数据类型--{{ readonlyComplex }}
    </a-button>
  </a-space>

  <h6 class="desc-margin">shallowReadonly: readonly() 的浅层作用形式</h6>
  <div class="comment-margin">
    <span>说明：</span>
    <div class="comment-desc">
      和 readonly()
      不同，这里没有深层级的转换：只有根层级的属性变为了只读。属性的值都会被原样存储和暴露，这也意味着值为
      ref 的属性不会被自动解包了。
    </div>
  </div>
  <a-divider></a-divider>

  <h4 class="v-w-item">toRaw(): 根据一个 Vue 创建的代理返回其原始对象。</h4>
  <div class="comment-margin">
    <span>说明：</span>
    <div class="comment-desc">
      toRaw() 可以返回由 reactive()、readonly()、shallowReactive() 或者
      shallowReadonly() 创建的代理对应的原始对象。 <br />
      这是一个可以用于临时读取而不引起代理访问/跟踪开销，或是写入而不触发更改的特殊方法。不建议保存对原始对象的持久引用，请谨慎使用。
    </div>
  </div>
  <a-space class="common-margin">
    <a-button size="small" @click="handleReactiveRawData">
      引用数据类型--{{ reactiveRawData }}
    </a-button>
    <a-button size="small" @click="handleToRawReactiveRawData">
      引用数据类型--调用toRaw(){{ toRawReactiveRawData }}
    </a-button>
  </a-space>
  <a-divider></a-divider>

  <h4 class="v-w-item">
    markRaw(): 将一个对象标记为不可被转为代理。返回该对象本身。
  </h4>
  <div class="comment-margin">
    <span>说明：</span>
    <div class="comment-desc">
      markRaw() 和类似 shallowReactive() 这样的浅层式 API
      使你可以有选择地避开默认的深度响应/只读转换，并在状态关系谱中嵌入原始的、非代理的对象。<br />它们可能出于各种各样的原因被使用：
      有些值不应该是响应式的，例如复杂的第三方类实例或 Vue 组件对象。
      当呈现带有不可变数据源的大型列表时，跳过代理转换可以提高性能。
    </div>
  </div>
</template>
<style lang="less" scoped>
.common-margin {
  margin: 10px 0 14px;
}

.desc-margin {
  line-height: 1.5;
}

.comment-desc {
  padding-left: 15px;
  margin-top: 5px;
  line-height: 1.5;
}

.v-w-item {
  color: @geekblue;
}
</style>

import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'myComponent',
  props: {
    msg: {
      type: String
    }
  },
  setup(props) {
    return () => {
      return h('div', props.msg);
    };
  }
});

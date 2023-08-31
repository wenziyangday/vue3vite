import { type App } from 'vue';

export default {
  install(app: App) {
    app.directive('demo', function (el, binding) {
      console.log(el, binding);
      // el 可用于操作dom
      el.style.display = 'none';
    });
    app.directive('debounce', function (el, binding) {
      let timer: null | number = null;
      el.addEventListener('click', function () {
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(() => {
          binding.value();
        }, 1000);
      });
    });
    app.directive('hasPermission', function (el, binding) {
      console.log(el, binding, 'jkjjkj');
    });
  }
};

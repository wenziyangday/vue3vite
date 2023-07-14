import { type App } from 'vue';

export default {
  install(app: App) {
    app.component('my-btn', {
      template: '<div>my-btn</div>'
    });
  }
};

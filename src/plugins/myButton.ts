import { type App } from 'vue';

export default {
  install(app: App, option: any) {
    app.component('my-btn', {
      template: `<div>my-btn</div>`
    });
  }
};

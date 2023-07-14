import { defineStore } from 'pinia';

export const useShop = defineStore('shops', {
  state: () => {
    return {
      name: '花莲',
      age: 100,
      isGrade: false
    };
  },
  getters: {
    randomName: (state) => {
      state.name = `${state.name}${Math.random() * 1888}`;
      return state.name;
    }
  },
  actions: {
    updName: function () {
      const name: string = this.name;
      this.name = `${name} ${Math.random() * 1888}`;
    }
  }
});

import { defineStore } from 'pinia';

import { getInfo, login, logout } from '@/apis/login';
import constants from '@/constants/constants';
import { type UserInfoForm } from '@/types/userInfo';
import { getToken, removeToken, setToken } from '@/utils/token';

export const useUser = defineStore('user', {
  state: () => {
    return {
      token: getToken(constants.token),
      name: '',
      avatar: '',
      expiresIn: '',
      roles: [],
      permissions: []
    };
  },

  actions: {
    /**
     * 用户登录
     * */
    loginACT(userInfo: UserInfoForm): Promise {
      return new Promise((resolve, reject) => {
        const { uuid, code, username, password } = userInfo;
        login(username, password, code, uuid)
          .then((res) => {
            const { token } = res;
            setToken(token);
            this.token = token;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    /**
     * 获取用户信息
     * */
    getInfoACT(): Promise {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const {
              user: { userName, avatar },
              roles,
              permissions
            } = res;
            this.avatar = avatar ?? require('@/assets/logo.png');
            this.name = userName;
            if (roles && roles.length > 0) {
              this.roles = roles;
              this.permissions = permissions;
            } else {
              this.roles = ['ROLE_DEFAULT'];
            }

            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    /**
     * 用户登出
     * */
    logoutACT() {
      return new Promise((resolve, reject) => {
        logout(this.token)
          .then(() => {
            this.token = '';
            this.roles = [];
            this.permissions = [];
            removeToken();
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
});

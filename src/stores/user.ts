import { defineStore } from 'pinia';

import { getInfo, login, logout } from '@/apis/login';
import constants from '@/constants/constants';
import { type UserInfoForm } from '@/types/userInfo';
import { getToken, setToken } from '@/utils/token';

const TOKEN =
  'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImRhYzQzYTY2LTk5ZWUtNGY0ZC1hY2YxLWRmOGViMjdiNDNkMSJ9.M3apZG2xDwjYgeNjGSab8nmnfwIY8OX3U-m4R3RegBRRLDzFmSmBoqZ26R0sJR-8ByR6KkIOYMOWS-wdXLZbKA';

export const useUser = defineStore('user', {
  state: () => {
    return {
      token: TOKEN ?? getToken(constants.token),
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
            const { data } = res;
            setToken(data.access_token);
            this.token = data.access_token;
            this.expiresIn = data.time;
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
              user: { userName },
              avatar,
              roles,
              permissions
            } = res;
            this.avatar = avatar ?? require('@/assets/images/profile.jpg');
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
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
});

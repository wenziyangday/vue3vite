/**
 * @description 用户登录入参
 * */
export interface UserInfoForm {
  username: string;
  password: string;
  code: string;
  remember: boolean;
  uuid: string;
}

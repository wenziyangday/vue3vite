/**
 * @description 常量文件
 * */
interface Constants {
  token: string;
  tokenPrefix: string;
  repeatSubmit: string;
}

const constants: Constants = {
  token: 'ADMIN_TOKEN',
  tokenPrefix: 'Bearer',
  repeatSubmit: 'RS_OBJ'
};

export default constants;

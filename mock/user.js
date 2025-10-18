// mock/user.js
import Mock from 'mockjs'
import { makeHashKey } from "@/utils/common.js";
import { users } from './_showdata.js'

export const login = ({ username, password }) => {
  const key = makeHashKey({ username, password })
  if (key in users) {
    return {
      code: 200,
      msg: '登录成功',
      data: users[key]
      // Mock.mock({
      //   id: '@id',
      //   name: '@cname',
      //   token: '@guid',
      // }),
    }
  }
  return { code: 401, msg: '用户名或密码错误', data: null }
}
export const register = ({ username, password }) => {
  return {
    code: 200,
    msg: '注册成功',
    data: {
      uid: Mock.Random.guid(),
      username,
    },
  }
}
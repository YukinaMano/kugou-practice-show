// mock/user.js
import Mock from 'mockjs'
import { makeHashKey } from "@/utils/common.js";
import { users } from './showdata.js'

/**
 * 用户相关接口模拟
 */

// 登录接口
Mock.mock('api/users/login', 'post', (options) => {
  const body = JSON.parse(options.body)
  const { username, password } = body
  console.log(options)
  const key = makeHashKey({ username, password })
  if (users[key]) {
    return {
      code: 200,
      msg: '登录成功',
      data: users[key] // 直接返回 value
    }
  } else {
    return {
      code: 401,
      msg: '用户名或密码错误',
      data: null
    }
  }
})

// 注册接口
Mock.mock('/users/register', 'post', (options) => {
  const body = JSON.parse(options.body)
  const { username, password } = body

  // 简单示例，直接返回成功
  return {
    code: 200,
    msg: '注册成功',
    data: {
      uid: Mock.Random.guid(),
      username
    }
  }
})

export default Mock

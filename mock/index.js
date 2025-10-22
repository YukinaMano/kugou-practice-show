// mock/index.js
import * as user from './user.js'
import * as music from './music.js'
import { tokenManager } from './_showdata.js'
// 如果有其他模块，比如 playlist.js、song.js，可以在这里导入
// import './playlist.js'
// import './song.js'
tokenManager.init()
export default { user, music }

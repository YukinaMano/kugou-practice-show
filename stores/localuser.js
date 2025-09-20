// stores/localuser.js
import { defineStore } from 'pinia'

export const localUserInfo = defineStore('localuser', {
  state: () => ({
    userKey: ''
  }),
  actions: {
    userLogin(key) {
      this.userKey = key
    }
  }
})

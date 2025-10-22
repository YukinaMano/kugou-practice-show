// stores/localuser.js
import { defineStore } from 'pinia'

export const localUserInfo = defineStore('localuser', {
  state: () => ({
    access_token: ''
  }),
  actions: {
    updateAccessToken(key) {
      this.access_token = key
    }
  }
})

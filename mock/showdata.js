import { makeHashKey } from "@/utils/common.js";

export const users = {
  [makeHashKey({ username: 'test', password: '123' })]: {
    id: 1,
    username: 'test',
    password: '123'
  },
  [makeHashKey({ username: 'scholar', password: '456' })]: {
    id: 2,
    username: 'scholar',
    password: '456'
  }
};

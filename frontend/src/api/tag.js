import http from './index';

export const tagAPI = {
  // 获取全部标签（含每个标签下的题目数）
  async getList() {
    const res = await http.get('/tags');
    return res.data;
  },

  // 创建标签
  async create(name) {
    const res = await http.post('/tags', { name });
    return res.data;
  },

  // 删除标签
  async remove(id) {
    const res = await http.delete(`/tags/${id}`);
    return res.data;
  },
};

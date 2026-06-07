import http from './index';

export const questionAPI = {
  // 题目列表（支持筛选 + 分页）
  async getList(params = {}) {
    const res = await http.get('/questions', { params });
    return res.data;
  },

  // 全文搜索
  async search(params = {}) {
    const res = await http.get('/questions/search', { params });
    return res.data;
  },

  // 题目详情
  async getById(id) {
    const res = await http.get(`/questions/${id}`);
    return res.data;
  },

  // 创建题目
  async create(data) {
    const res = await http.post('/questions', data);
    return res.data;
  },

  // 更新题目
  async update(id, data) {
    const res = await http.put(`/questions/${id}`, data);
    return res.data;
  },

  // 删除题目
  async remove(id) {
    const res = await http.delete(`/questions/${id}`);
    return res.data;
  },

  // 切换错题标记
  async toggleMistake(id) {
    const res = await http.patch(`/questions/${id}/toggle-mistake`);
    return res.data;
  },
};

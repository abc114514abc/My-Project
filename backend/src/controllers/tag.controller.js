const Tag = require('../models/tag.model');
const { success, fail } = require('../utils/response');

const tagController = {
  // GET /api/tags
  async list(req, res, next) {
    const tags = await Tag.findAll();
    res.json(success(tags));
  },

  // POST /api/tags
  async create(req, res, next) {
    const { name } = req.body;
    const existing = await Tag.findByName(name);
    if (existing) {
      return res.status(400).json(fail('标签已存在'));
    }
    const id = await Tag.create(name);
    res.status(201).json(success({ id, name }, '标签创建成功'));
  },

  // DELETE /api/tags/:id
  async remove(req, res, next) {
    const affected = await Tag.delete(req.params.id);
    if (affected === 0) {
      return res.status(404).json(fail('标签不存在', 404));
    }
    res.json(success(null, '标签已删除'));
  },
};

module.exports = tagController;

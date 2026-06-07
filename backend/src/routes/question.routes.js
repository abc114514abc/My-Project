const router = require('express').Router();
const auth = require('../middleware/auth');
const { validate, required, isString, minLen, maxLen, isIn, isArray } = require('../middleware/validate');
const questionController = require('../controllers/question.controller');

// 所有路由都需要登录
router.use(auth);

// GET  /api/questions         — 列表
// GET  /api/questions/search  — 全文搜索
router.get('/search', questionController.search);
router.get('/', questionController.list);

// POST /api/questions         — 创建
router.post(
  '/',
  validate({
    title: [required, isString, minLen(1), maxLen(200)],
    content: [isString, maxLen(50000)],
    difficulty: [isIn(['easy', 'medium', 'hard'])],
    source: [isString, maxLen(100)],
    tagIds: [isArray],
  }),
  questionController.create
);

// GET  /api/questions/:id     — 详情
router.get('/:id', questionController.detail);

// PUT  /api/questions/:id     — 更新
router.put(
  '/:id',
  validate({
    title: [required, isString, minLen(1), maxLen(200)],
    content: [isString, maxLen(50000)],
    difficulty: [isIn(['easy', 'medium', 'hard'])],
    source: [isString, maxLen(100)],
    tagIds: [isArray],
  }),
  questionController.update
);

// DELETE /api/questions/:id   — 删除
router.delete('/:id', questionController.remove);

// PATCH  /api/questions/:id/toggle-mistake — 切换错题
router.patch('/:id/toggle-mistake', questionController.toggleMistake);

module.exports = router;

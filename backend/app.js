require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./src/routes/auth.routes');
const questionRoutes = require('./src/routes/question.routes');
const tagRoutes = require('./src/routes/tag.routes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- 全局中间件 ----
app.use(cors());
app.use(express.json());

// 1. 让 Express 能够识别并直接读取 dist 文件夹里的静态资源（如 css, js, 图片）
app.use(express.static(path.join(__dirname, 'dist')));

// ---- 路由挂载 ----
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/tags', tagRoutes);

// ---- 健康检查 ----
app.get('/api/health', (req, res) => {
  res.json({ code: 200, message: 'ok' });
});

// 2. 配置通配符路由：任何找不到的页面请求，全都返回前端的 index.html（防止 Vue 路由刷新 404）
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// ---- 全局错误处理（必须放最后） ----
app.use(errorHandler);




if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;


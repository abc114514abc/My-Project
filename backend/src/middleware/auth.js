const jwt = require('jsonwebtoken');
const { fail } = require('../utils/response');

function auth(req, res, next) {
  const header = req.headers.authorization;

  // 1. 检查是否有 Authorization 头，格式是否为 Bearer xxx
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json(fail('未登录，请先登录', 401));
  }

  // 2. 提取 token
  const token = header.split(' ')[1];
  
   // 3. 用 JWT_SECRET 验证 token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;   // 后续路由通过 req.userId 获取当前用户
    next();
  } catch (err) {
    return res.status(401).json(fail('登录已过期，请重新登录', 401));
  }
}

module.exports = auth;

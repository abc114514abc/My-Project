const { fail } = require('../utils/response');

/**
 * 轻量参数校验中间件工厂
 *
 * schema 格式：
 * {
 *   字段名: [ruleFn1, ruleFn2, ...]
 * }
 *
 * 每个 ruleFn 签名：(value, fieldName, allValues) → errorString | null
 */

// ---- 内置校验函数 ----
const required = (value, field) =>
  value === undefined || value === null || value === ''
    ? `${field} 不能为空`
    : null;

const isString = (value, field) =>
  value !== undefined && typeof value !== 'string'
    ? `${field} 必须为字符串`
    : null;

const minLen = (min) => (value, field) =>
  value !== undefined && value.length < min
    ? `${field} 长度不能少于 ${min}`
    : null;

const maxLen = (max) => (value, field) =>
  value !== undefined && value.length > max
    ? `${field} 长度不能超过 ${max}`
    : null;

const isIn = (list) => (value, field) =>
  value !== undefined && !list.includes(value)
    ? `${field} 只能为 ${list.join(' / ')}`
    : null;

const isInt = (value, field) =>
  value !== undefined && (!Number.isInteger(value) && !Number.isInteger(Number(value)))
    ? `${field} 必须为整数`
    : null;

const isArray = (value, field) =>
  value !== undefined && !Array.isArray(value)
    ? `${field} 必须为数组`
    : null;

/**
 * @param {Object} schema  — { field: [ruleFn, ...] }
 * @returns {Function} express middleware
 */
function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      for (const rule of rules) {
        const msg = rule(value, field, req.body);
        if (msg) errors.push(msg);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json(fail(errors.join('; ')));
    }

    next();
  };
}

module.exports = {
  validate,
  required,
  isString,
  minLen,
  maxLen,
  isIn,
  isInt,
  isArray,
};

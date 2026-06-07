const pool = require('../config/db');

const Tag = {
  // 全部标签
  async findAll() {
    const [rows] = await pool.execute(
      `SELECT t.id, t.name, COUNT(qt.question_id) AS question_count
       FROM tags t
       LEFT JOIN question_tags qt ON t.id = qt.tag_id
       GROUP BY t.id
       ORDER BY t.name`
    );
    return rows;
  },

  // 按 ID 查
  async findById(id) {
    const [rows] = await pool.execute(`SELECT id, name FROM tags WHERE id = ?`, [id]);
    return rows[0] || null;
  },

  // 按名称查
  async findByName(name) {
    const [rows] = await pool.execute(`SELECT id, name FROM tags WHERE name = ?`, [name]);
    return rows[0] || null;
  },

  // 创建
  async create(name) {
    const [result] = await pool.execute(`INSERT INTO tags (name) VALUES (?)`, [name]);
    return result.insertId;
  },

  // 删除（外键 CASCADE 自动清理 question_tags）
  async delete(id) {
    const [result] = await pool.execute(`DELETE FROM tags WHERE id = ?`, [id]);
    return result.affectedRows;
  },
};

module.exports = Tag;

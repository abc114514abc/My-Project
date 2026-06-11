export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('zh-CN');
}

export function formatRelativeDate(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 周前`;
  return formatDate(dateStr);
}

export const difficultyLabel = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

export const difficultyShort = {
  easy: '简',
  medium: '中',
  hard: '难',
};

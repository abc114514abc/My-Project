/**
 * 简易 Markdown → HTML
 * 支持：h2/h3/h4、粗体、斜体、行内代码、代码块、无序列表、段落
 */
export function markdownToHtml(md) {
  if (!md) return '';

  // 1. 转义 HTML 实体
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. 代码块 ```\n...\n```
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

  // 3. 行内代码 `...`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 4. 标题 ### / ## / #
  html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>');

  // 5. 粗体 **text** / 斜体 *text*
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // 6. 无序列表 - item
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');

  // 7. 段落
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');

  return '<p>' + html + '</p>';
}

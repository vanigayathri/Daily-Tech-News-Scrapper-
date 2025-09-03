// generateMarkdown.js
function createMarkdown(newsItems, dateStr) {
  return `---
title: "Daily Tech Pulse – ${dateStr}"
date: ${dateStr}
layout: post
---

# Daily Tech News Digest (${dateStr})

${newsItems.map(item => `## [${item.title}](${item.url})\n${item.summary}`).join('\n\n')}
`;
}

module.exports = createMarkdown;

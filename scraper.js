const puppeteer = require('puppeteer');

async function fetchArticleSummary(url, page) {
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    // Extract the first paragraph or meta description as summary
    const summary = await page.evaluate(() => {
      // Try to get meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && metaDesc.content) return metaDesc.content;

      // fallback: first paragraph of article content
      const firstPara = document.querySelector('article p');
      return firstPara ? firstPara.innerText.trim() : '';
    });
    return summary;
  } catch (err) {
    console.error(`Failed to fetch summary for ${url}`, err);
    return '';
  }
}

async function fetchTechNews() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://techcrunch.com/', { waitUntil: 'networkidle2' });

  // Get headlines and URLs
  const articles = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('div.wp-block-group a')).filter(a =>
      a.href &&
      a.innerText.length > 25 &&
      /^https:\/\/techcrunch\.com\//.test(a.href)
    ).slice(0, 5);

    return links.map(a => ({ title: a.innerText.trim(), url: a.href }));
  });

  // Fetch summaries for each article
  for (let article of articles) {
    article.summary = await fetchArticleSummary(article.url, page);
  }

  await browser.close();
  return articles;
}

module.exports = fetchTechNews;




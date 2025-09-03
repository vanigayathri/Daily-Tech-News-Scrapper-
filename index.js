const fetchTechNews = require('./scraper');
const createMarkdown = require('./generateMarkdown');
const fs = require('fs');
const simpleGit = require('simple-git');
const git = simpleGit();

async function main() {
  try {
    console.log('Starting to fetch tech news...');
    const newsItems = await fetchTechNews();
    console.log(`Fetched ${newsItems.length} articles.`);

    const today = new Date().toISOString().slice(0, 10);
    const markdown = createMarkdown(newsItems, today);

    const filename = `digest-${today}.md`;
    fs.writeFileSync(filename, markdown, 'utf8');
    console.log(`Daily digest markdown created: ${filename}`);

    await git.add(filename);
    console.log('Added new file to git.');

    await git.commit(`Add daily tech digest for ${filename}`);
    console.log('Committed the new file.');

    await git.push('origin', 'main');
    console.log('Pushed changes to GitHub.');
  } catch (error) {
    console.error('Error generating and pushing daily digest:', error);
  }
}

main();


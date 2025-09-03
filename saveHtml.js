const axios = require('axios');
const fs = require('fs');

axios.get('https://techcrunch.com/').then(response => {
  fs.writeFileSync('techcrunch.html', response.data);
  console.log('Saved TechCrunch homepage HTML to techcrunch.html');
}).catch(error => {
  console.error('Error fetching page:', error);
});

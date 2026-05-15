import axios from 'axios';

async function testScrape() {
  const query = encodeURIComponent("Virat Kohli IPL portrait");
  const url = `https://www.bing.com/images/search?q=${query}&form=HDRSC2&first=1&tsc=ImageHoverTitle`;
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });
    const matches = res.data.match(/murl&quot;:&quot;(https:\/\/[^&]+)&quot;/g);
    if (matches) {
      console.log("Found matches:");
      matches.slice(0, 5).forEach(m => {
        console.log(m.replace('murl&quot;:&quot;', '').replace('&quot;', ''));
      });
    } else {
      console.log("No matches found. Trying another regex.");
      const matches2 = res.data.match(/murl":"(https:\/\/[^"]+)"/g);
      if (matches2) {
        matches2.slice(0, 5).forEach(m => {
          console.log(m.replace('murl":"', '').replace('"', ''));
        });
      } else {
        console.log("Still no matches.");
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

testScrape();

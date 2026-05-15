import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../public/players');
const REPORTS_DIR = path.join(__dirname, '../public/players/reports');

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

// Full 80+ player list
const players = [
  { name: "MS Dhoni", team: "CSK", role: "Wicket-keeper" },
  { name: "Ravindra Jadeja", team: "CSK", role: "All-rounder" },
  { name: "Ruturaj Gaikwad", team: "CSK", role: "Batsman" },
  { name: "Shivam Dube", team: "CSK", role: "All-rounder" },
  { name: "Matheesha Pathirana", team: "CSK", role: "Bowler" },
  { name: "Deepak Chahar", team: "CSK", role: "Bowler" },
  { name: "Rachin Ravindra", team: "CSK", role: "All-rounder" },
  { name: "Devon Conway", team: "CSK", role: "Batsman" },

  { name: "Rohit Sharma", team: "MI", role: "Batsman" },
  { name: "Jasprit Bumrah", team: "MI", role: "Bowler" },
  { name: "Suryakumar Yadav", team: "MI", role: "Batsman" },
  { name: "Hardik Pandya", team: "MI", role: "All-rounder" },
  { name: "Ishan Kishan", team: "MI", role: "Wicket-keeper" },
  { name: "Tim David", team: "MI", role: "Batsman" },
  { name: "Tilak Varma", team: "MI", role: "Batsman" },
  { name: "Piyush Chawla", team: "MI", role: "Bowler" },

  { name: "Virat Kohli", team: "RCB", role: "Batsman" },
  { name: "Faf du Plessis", team: "RCB", role: "Batsman" },
  { name: "Glenn Maxwell", team: "RCB", role: "All-rounder" },
  { name: "Mohammed Siraj", team: "RCB", role: "Bowler" },
  { name: "Rajat Patidar", team: "RCB", role: "Batsman" },
  { name: "Cameron Green", team: "RCB", role: "All-rounder" },
  { name: "Will Jacks", team: "RCB", role: "All-rounder" },
  { name: "Dinesh Karthik", team: "RCB", role: "Wicket-keeper" },

  { name: "Andre Russell", team: "KKR", role: "All-rounder" },
  { name: "Sunil Narine", team: "KKR", role: "All-rounder" },
  { name: "Rinku Singh", team: "KKR", role: "Batsman" },
  { name: "Shreyas Iyer", team: "KKR", role: "Batsman" },
  { name: "Mitchell Starc", team: "KKR", role: "Bowler" },
  { name: "Varun Chakaravarthy", team: "KKR", role: "Bowler" },
  { name: "Venkatesh Iyer", team: "KKR", role: "All-rounder" },
  { name: "Phil Salt", team: "KKR", role: "Wicket-keeper" },

  { name: "Travis Head", team: "SRH", role: "Batsman" },
  { name: "Heinrich Klaasen", team: "SRH", role: "Wicket-keeper" },
  { name: "Pat Cummins", team: "SRH", role: "Bowler" },
  { name: "Abhishek Sharma", team: "SRH", role: "All-rounder" },
  { name: "Bhuvneshwar Kumar", team: "SRH", role: "Bowler" },
  { name: "T Natarajan", team: "SRH", role: "Bowler" },
  { name: "Aiden Markram", team: "SRH", role: "Batsman" },
  { name: "Nitish Kumar Reddy", team: "SRH", role: "All-rounder" },

  { name: "Sanju Samson", team: "RR", role: "Wicket-keeper" },
  { name: "Jos Buttler", team: "RR", role: "Wicket-keeper" },
  { name: "Yashasvi Jaiswal", team: "RR", role: "Batsman" },
  { name: "Yuzvendra Chahal", team: "RR", role: "Bowler" },
  { name: "Trent Boult", team: "RR", role: "Bowler" },
  { name: "Riyan Parag", team: "RR", role: "All-rounder" },
  { name: "Ravichandran Ashwin", team: "RR", role: "All-rounder" },
  { name: "Sandeep Sharma", team: "RR", role: "Bowler" },

  { name: "Rishabh Pant", team: "DC", role: "Wicket-keeper" },
  { name: "David Warner", team: "DC", role: "Batsman" },
  { name: "Axar Patel", team: "DC", role: "All-rounder" },
  { name: "Kuldeep Yadav", team: "DC", role: "Bowler" },
  { name: "Tristan Stubbs", team: "DC", role: "Wicket-keeper" },
  { name: "Jake Fraser-McGurk", team: "DC", role: "Batsman" },
  { name: "Khaleel Ahmed", team: "DC", role: "Bowler" },

  { name: "Sam Curran", team: "PBKS", role: "All-rounder" },
  { name: "Kagiso Rabada", team: "PBKS", role: "Bowler" },
  { name: "Arshdeep Singh", team: "PBKS", role: "Bowler" },
  { name: "Liam Livingstone", team: "PBKS", role: "All-rounder" },
  { name: "Jonny Bairstow", team: "PBKS", role: "Wicket-keeper" },
  { name: "Shashank Singh", team: "PBKS", role: "Batsman" },
  { name: "Ashutosh Sharma", team: "PBKS", role: "Batsman" },
  { name: "Harshal Patel", team: "PBKS", role: "Bowler" },

  { name: "KL Rahul", team: "LSG", role: "Wicket-keeper" },
  { name: "Nicholas Pooran", team: "LSG", role: "Wicket-keeper" },
  { name: "Marcus Stoinis", team: "LSG", role: "All-rounder" },
  { name: "Quinton de Kock", team: "LSG", role: "Wicket-keeper" },
  { name: "Ravi Bishnoi", team: "LSG", role: "Bowler" },
  { name: "Krunal Pandya", team: "LSG", role: "All-rounder" },
  { name: "Naveen-ul-Haq", team: "LSG", role: "Bowler" },

  { name: "Shubman Gill", team: "GT", role: "Batsman" },
  { name: "Rashid Khan", team: "GT", role: "Bowler" },
  { name: "Sai Sudharsan", team: "GT", role: "Batsman" },
  { name: "David Miller", team: "GT", role: "Batsman" },
  { name: "Rahul Tewatia", team: "GT", role: "All-rounder" },
  { name: "Mohammed Shami", team: "GT", role: "Bowler" },
  { name: "Mohit Sharma", team: "GT", role: "Bowler" }
];

const toKebabCase = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getImageUrl(playerName) {
  // Query optimized for cinematic / dark background / stadium lighting portraits
  const query = encodeURIComponent(`${playerName} IPL portrait dark background high quality`);
  const url = `https://www.bing.com/images/search?q=${query}&form=HDRSC2&first=1&tsc=ImageHoverTitle`;
  
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });
    
    // Extract multiple possible matches
    const matches = res.data.match(/murl&quot;:&quot;(https:\/\/[^&]+)&quot;/g);
    if (matches && matches.length > 0) {
      const urls = matches.map(m => m.replace('murl&quot;:&quot;', '').replace('&quot;', ''));
      return urls;
    }
  } catch (err) {
    console.error(`Error searching image for ${playerName}: ${err.message}`);
  }
  return [];
}

async function downloadAndProcessImage(url, outputPath) {
  try {
    const response = await axios({
      url,
      responseType: 'arraybuffer',
      timeout: 10000,
    });
    
    const buffer = Buffer.from(response.data, 'binary');
    
    // Premium Processing for visually consistent cinematic gaming cards
    await sharp(buffer)
      .resize(600, 800, {
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy // Auto-centers on the face/chest
      })
      .modulate({
        brightness: 0.95,  // Slightly darken to match dark neon UI
        saturation: 1.15,  // Boost colors slightly for a premium feel
      })
      // Enhance contrast using a subtle linear curve via tint/normalize
      .normalize()
      .png({ quality: 85, compressionLevel: 8 })
      .toFile(outputPath);
      
    return true;
  } catch (err) {
    console.error(`Failed to process image from ${url}: ${err.message}`);
    return false;
  }
}

async function buildPipeline() {
  const resultData = [];
  const failedDownloads = [];
  const duplicates = [];
  const ids = new Set();

  let existingCount = 0;
  let downloadedCount = 0;

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const id = toKebabCase(player.name);
    
    console.log(`[${i + 1}/${players.length}] Processing ${player.name}...`);
    
    if (ids.has(id)) {
      console.warn(`Duplicate found: ${player.name}`);
      duplicates.push(player);
      continue;
    }
    ids.add(id);
    
    const outputPath = path.join(OUTPUT_DIR, `${id}.png`);
    
    // CRITICAL: Check if image already exists (preserve premium assets)
    if (fs.existsSync(outputPath)) {
      console.log(`  ✓ Skipped (Existing Premium Image Kept)`);
      existingCount++;
      resultData.push({
        id,
        name: player.name,
        team: player.team,
        role: player.role,
        image: `/players/${id}.png`
      });
      continue;
    }
    
    // Image is missing, let's scrape and build
    const urls = await getImageUrl(player.name);
    let success = false;
    
    for (let u = 0; u < Math.min(3, urls.length); u++) {
      console.log(`  Trying URL ${u + 1}...`);
      success = await downloadAndProcessImage(urls[u], outputPath);
      if (success) {
        resultData.push({
          id,
          name: player.name,
          team: player.team,
          role: player.role,
          image: `/players/${id}.png`
        });
        downloadedCount++;
        break;
      }
    }
    
    if (!success) {
      console.error(`  X Failed to download image for ${player.name}`);
      failedDownloads.push(player);
      resultData.push({
        id,
        name: player.name,
        team: player.team,
        role: player.role,
        image: `/players/default-avatar.png`
      });
    } else {
      console.log(`  ✓ Success: Downloaded & Processed ${player.name}`);
    }
    
    // Polite delay for Bing search
    await delay(1200);
  }

  // Generate Reports
  fs.writeFileSync(path.join(OUTPUT_DIR, 'players.json'), JSON.stringify(resultData, null, 2));
  fs.writeFileSync(path.join(REPORTS_DIR, 'failed-downloads.json'), JSON.stringify(failedDownloads, null, 2));
  fs.writeFileSync(path.join(REPORTS_DIR, 'duplicates.json'), JSON.stringify(duplicates, null, 2));
  
  console.log('\n==================================');
  console.log('💎 Premium Pipeline Completed! 💎');
  console.log('==================================');
  console.log(`Total Players Processed: ${resultData.length}`);
  console.log(`Existing Images Kept Untouched: ${existingCount}`);
  console.log(`New Images Downloaded: ${downloadedCount}`);
  console.log(`Failed Downloads: ${failedDownloads.length}`);
}

buildPipeline();

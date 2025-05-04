const https = require('https');
const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, '../data/activity.json');
const CACHE_DURATION = 1000 * 60 * 5; // 5 menit

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function fetchEvents(username, callback) {
  const url = `https://api.github.com/users/${username}/events`;

  const options = {
    headers: {
      'User-Agent': 'node.js'
    }
  };

  https.get(url, options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode !== 200) {
        return callback(new Error(`GitHub API returned status code ${res.statusCode}`));
      }
      try {
        const json = JSON.parse(data);
        callback(null, json);
      } catch (err) {
        callback(err);
      }
    });
  }).on('error', callback);
}

function printEvents(events, filterType) {
  events.forEach(event => {
    if (filterType && event.type !== filterType) return;
    const repo = event.repo.name;
    const type = event.type;
    let action = '';

    switch (type) {
      case 'PushEvent':
        action = `Pushed ${event.payload.commits?.length || 0} commit(s) to ${repo}`;
        break;
      case 'IssuesEvent':
        action = `${event.payload.action} issue in ${repo}`;
        break;
      case 'IssueCommentEvent':
        action = `Commented on issue in ${repo}`;
        break;
      case 'WatchEvent':
        action = `Starred ${repo}`;
        break;
      case 'ForkEvent':
        action = `Forked ${repo}`;
        break;
      default:
        action = `${type} on ${repo}`;
    }

    console.log(`- ${action}`);
  });
}

function loadCache() {
  try {
    const data = fs.readFileSync(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveCache(data) {
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`${colors.red}❌ Gagal menyimpan cache:${colors.reset}`, err.message);
  }
}

function fetchRateLimit(callback) {
  const url = 'https://api.github.com/rate_limit';
  const options = {
    headers: {
      'User-Agent': 'node.js'
    }
  };

  https.get(url, options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const rate = json.rate;
        callback(null, rate);
      } catch (err) {
        callback(err);
      }
    });
  }).on('error', callback);
}

module.exports = {
  fetchEvents,
  printEvents,
  loadCache,
  saveCache,
  fetchRateLimit,
  colors,
  CACHE_DURATION
};

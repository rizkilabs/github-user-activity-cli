#!/usr/bin/env node

const https = require("https");
const readline = require("readline");

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
};

// Fetch user events
function fetchEvents(username, callback) {
  const url = `https://api.github.com/users/${username}/events`;

  const options = {
    headers: {
      "User-Agent": "node-cli",
      "Accept": "application/vnd.github.v3+json"
    }
  };

  https.get(url, options, (res) => {
    let data = "";

    if (res.statusCode === 404) {
      callback(new Error("User not found"));
      return;
    }

    res.on("data", chunk => data += chunk);
    res.on("end", () => {
      try {
        const events = JSON.parse(data);
        callback(null, events);
      } catch (err) {
        callback(err);
      }
    });
  }).on("error", err => {
    callback(err);
  });
}

// Fetch API rate limit
function fetchRateLimit(callback) {
  https.get("https://api.github.com/rate_limit", {
    headers: { "User-Agent": "node-cli" }
  }, (res) => {
    let data = "";

    res.on("data", chunk => data += chunk);
    res.on("end", () => {
      try {
        const json = JSON.parse(data);
        const rate = json.rate;
        callback(null, rate);
      } catch (err) {
        callback(err);
      }
    });
  }).on("error", err => {
    callback(err);
  });
}

// Format and print events
function printEvents(events, filter = null) {
  if (!Array.isArray(events)) {
    console.log(`${colors.red}❌ Tidak ada aktivitas untuk ditampilkan.${colors.reset}`);
    return;
  }

  const filtered = filter
    ? events.filter(e => e.type.toLowerCase() === filter.toLowerCase())
    : events;

  if (filtered.length === 0) {
    console.log(`${colors.yellow}⚠️ Tidak ada event yang cocok dengan filter: ${filter}${colors.reset}`);
    return;
  }

  filtered.forEach(event => {
    const { type, repo, payload } = event;
    const repoName = repo?.name || "unknown repo";

    let action = "";
    switch (type) {
      case "PushEvent":
        const commitCount = payload.commits?.length || 0;
        action = `Pushed ${commitCount} commit(s) to ${repoName}`;
        break;
      case "IssuesEvent":
        action = `${payload.action} an issue in ${repoName}`;
        break;
      case "IssueCommentEvent":
        action = `${payload.action} a comment on issue in ${repoName}`;
        break;
      case "PullRequestEvent":
        action = `${payload.action} a pull request in ${repoName}`;
        break;
      case "WatchEvent":
        action = `Starred ${repoName}`;
        break;
      case "ForkEvent":
        action = `Forked ${repoName}`;
        break;
      case "CreateEvent":
        action = `Created ${payload.ref_type} in ${repoName}`;
        break;
      default:
        action = `Did ${type} in ${repoName}`;
    }

    console.log(`${colors.green}- ${action}${colors.reset}`);
  });
}

// CLI interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`${colors.bold}${colors.cyan}=== GitHub Activity Viewer ===${colors.reset}\n`);

rl.question("Masukkan username GitHub: ", (username) => {
  if (!username) {
    console.log(`${colors.red}❌ Username tidak boleh kosong.${colors.reset}`);
    rl.close();
    return;
  }

  rl.question("Filter event type (misal: PushEvent)? Tekan Enter jika tidak ingin filter: ", (filter) => {
    console.log(`\n${colors.cyan}🔍 Mengambil data aktivitas...${colors.reset}\n`);

    fetchEvents(username, (err, events) => {
      if (err) {
        console.error(`${colors.red}❌ Error:${colors.reset} ${err.message}`);
        rl.close();
        return;
      }

      console.log(`${colors.bold}${colors.yellow}📌 Aktivitas terbaru dari ${username}:${colors.reset}`);
      printEvents(events, filter || null);

      // Optional: tampilkan rate limit
      fetchRateLimit((err, rate) => {
        if (!err) {
          console.log(`\n📉 ${colors.yellow}Sisa limit API GitHub: ${rate.remaining}/${rate.limit}${colors.reset}`);
        }
        rl.close();
      });
    });
  });
});

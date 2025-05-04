// github.js
const https = require("https");
const { saveToFile, formatDate } = require("./utils");

function fetchEvents(username, callback) {
  const url = `https://api.github.com/users/${username}/events`;

  const options = {
    headers: {
      "User-Agent": "github-activity-cli",
      "Accept": "application/vnd.github.v3+json"
    }
  };

  https.get(url, options, (res) => {
    let data = "";

    res.on("data", chunk => data += chunk);

    res.on("end", () => {
      if (res.statusCode !== 200) {
        return callback(new Error(`Gagal mengambil data. Status: ${res.statusCode}`));
      }

      try {
        const json = JSON.parse(data);
        saveToFile("activity.json", json); // simpan ke file
        callback(null, json);
      } catch (err) {
        callback(err);
      }
    });
  }).on("error", (err) => {
    callback(err);
  });
}

function fetchRateLimit(callback) {
  https.get("https://api.github.com/rate_limit", {
    headers: { "User-Agent": "github-activity-cli" }
  }, (res) => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => {
      try {
        const json = JSON.parse(data);
        callback(null, json.rate);
      } catch (err) {
        callback(err);
      }
    });
  }).on("error", (err) => callback(err));
}

function printEvents(events, filterType = null) {
  events.forEach(event => {
    if (filterType && event.type !== filterType) return;

    let output = "";
    switch (event.type) {
      case "PushEvent":
        const commits = event.payload.commits.length;
        output = `Pushed ${commits} commit${commits > 1 ? "s" : ""} to ${event.repo.name}`;
        break;
      case "IssuesEvent":
        output = `${event.payload.action === "opened" ? "Opened" : "Updated"} an issue in ${event.repo.name}`;
        break;
      case "WatchEvent":
        output = `Starred ${event.repo.name}`;
        break;
      case "CreateEvent":
        output = `Created ${event.payload.ref_type} in ${event.repo.name}`;
        break;
      case "ForkEvent":
        output = `Forked ${event.repo.name}`;
        break;
      default:
        output = `${event.type} on ${event.repo.name}`;
    }

    const waktu = formatDate(event.created_at);
    console.log(`- ${output} (${waktu})`);
  });
}

module.exports = {
  fetchEvents,
  printEvents,
  fetchRateLimit,
};

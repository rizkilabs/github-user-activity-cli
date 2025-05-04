// index.js

const https = require("https");

// Ambil argumen dari CLI
const username = process.argv[2];

if (!username) {
  console.error("⚠️  Silakan masukkan nama pengguna GitHub.");
  console.error("Contoh: node index.js kamranahmedse");
  process.exit(1);
}

// URL endpoint API GitHub
const url = `https://api.github.com/users/${username}/events`;

// Konfigurasi permintaan
const options = {
  headers: {
    "User-Agent": "github-activity-cli", // GitHub API membutuhkan User-Agent
    "Accept": "application/vnd.github.v3+json"
  }
};

// Kirim permintaan ke GitHub API
https.get(url, options, (res) => {
  let data = "";

  // Kumpulkan data
  res.on("data", (chunk) => {
    data += chunk;
  });

  // Setelah data diterima
  res.on("end", () => {
    if (res.statusCode !== 200) {
      console.error(`❌ Gagal mengambil data. Kode status: ${res.statusCode}`);
      return;
    }

    try {
      const events = JSON.parse(data);
      if (!events.length) {
        console.log("Tidak ada aktivitas ditemukan.");
        return;
      }

      console.log(`📌 Aktivitas terbaru dari ${username}:`);
      events.forEach((event) => {
        let action = "";

        switch (event.type) {
          case "PushEvent":
            const commits = event.payload.commits.length;
            action = `Pushed ${commits} commit${commits > 1 ? "s" : ""} to ${event.repo.name}`;
            break;
          case "IssuesEvent":
            action = `${event.payload.action === "opened" ? "Opened" : "Updated"} an issue in ${event.repo.name}`;
            break;
          case "WatchEvent":
            action = `Starred ${event.repo.name}`;
            break;
          case "CreateEvent":
            action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
            break;
          case "ForkEvent":
            action = `Forked ${event.repo.name}`;
            break;
          default:
            action = `${event.type} on ${event.repo.name}`;
        }

        console.log("- " + action);
      });
    } catch (error) {
      console.error("❌ Terjadi kesalahan saat memproses data JSON:", error.message);
    }
  });
}).on("error", (err) => {
  console.error("❌ Terjadi kesalahan pada permintaan:", err.message);
});

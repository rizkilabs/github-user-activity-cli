// index.js
const { fetchEvents, printEvents, fetchRateLimit } = require("./github");

const username = process.argv[2];
const filterType = process.argv[3]; // opsional: filter jenis event

if (!username) {
  console.log("🔧 Usage: node index.js <username> [EventType]");
  console.log("Contoh: node index.js kamranahmedse PushEvent");
  process.exit(1);
}

console.log("🔄 Mengambil aktivitas GitHub...");

fetchEvents(username, (err, events) => {
  if (err) {
    console.error("❌ Error:", err.message);
    return;
  }

  console.log(`📌 Aktivitas terbaru dari ${username}:`);
  printEvents(events, filterType);

  fetchRateLimit((err, rate) => {
    if (!err) {
      console.log(`\n📉 Rate Limit: ${rate.remaining} dari ${rate.limit} permintaan tersedia`);
    }
  });
});

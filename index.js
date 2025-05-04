#!/usr/bin/env node
// index.js

const readline = require("readline");
const { fetchEvents, printEvents, fetchRateLimit } = require("./github");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Masukkan username GitHub: ", (username) => {
  if (!username) {
    console.log("❌ Username tidak boleh kosong.");
    rl.close();
    return;
  }

  rl.question("Ingin filter berdasarkan event type (misal: PushEvent)? (tekan Enter jika tidak): ", (filter) => {
    console.log("🔄 Mengambil aktivitas GitHub...\n");

    fetchEvents(username, (err, events) => {
      if (err) {
        console.error("❌ Error:", err.message);
        rl.close();
        return;
      }

      console.log(`📌 Aktivitas terbaru dari ${username}:`);
      printEvents(events, filter || null);

      fetchRateLimit((err, rate) => {
        if (!err) {
          console.log(`\n📉 Rate Limit: ${rate.remaining} dari ${rate.limit} permintaan tersedia`);
        }
        rl.close();
      });
    });
  });
});

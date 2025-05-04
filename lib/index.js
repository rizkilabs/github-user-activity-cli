const readline = require('readline');
const { fetchEvents, printEvents, loadCache, saveCache, fetchRateLimit, colors, CACHE_DURATION } = require('./utils');

function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Masukkan username GitHub: ", (username) => {
    if (!username) {
      console.log(`${colors.red}❌ Username tidak boleh kosong.${colors.reset}`);
      rl.close();
      return;
    }

    rl.question("Filter event type (misal: PushEvent)? Tekan Enter jika tidak ingin filter: ", (filter) => {
      console.log(`\n${colors.cyan}🔍 Mengambil data aktivitas...${colors.reset}\n`);

      const cache = loadCache();
      const userCache = cache[username];
      const now = Date.now();

      if (userCache && now - userCache.timestamp < CACHE_DURATION) {
        console.log(`${colors.green}📦 Mengambil dari cache...${colors.reset}`);
        printEvents(userCache.data, filter || null);
        rl.close();
      } else {
        fetchEvents(username, (err, events) => {
          if (err) {
            console.error(`${colors.red}❌ Error:${colors.reset} ${err.message}`);
            rl.close();
            return;
          }

          cache[username] = {
            timestamp: now,
            data: events
          };
          saveCache(cache);

          console.log(`${colors.bold}${colors.yellow}📌 Aktivitas terbaru dari ${username}:${colors.reset}`);
          printEvents(events, filter || null);

          fetchRateLimit((err, rate) => {
            if (!err) {
              console.log(`\n📉 ${colors.yellow}Sisa limit API GitHub: ${rate.remaining}/${rate.limit}${colors.reset}`);
            }
            rl.close();
          });
        });
      }
    });
  });
}

module.exports = main;

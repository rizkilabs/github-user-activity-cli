# GitHub User Activity CLI

A simple and beginner-friendly CLI tool that fetches and displays the latest public GitHub activity of any user directly in your terminal.

## 📦 Project Structure

```
github-user-activity-cli/
├── bin/
│   └── github.js           # CLI entry point
├── lib/
│   ├── index.js            # Main CLI logic (user prompt, caching, filtering)
│   └── utils.js            # Utility functions (fetching, caching, printing)
├── data/
│   └── activity.json       # Cached GitHub activity
├── package.json            # Project metadata and CLI config
```

## 🚀 Features

* Accepts a GitHub username from CLI input.
* Fetches recent public events using [GitHub Events API](https://api.github.com/users/:username/events).
* Optionally filters events by type (e.g., `PushEvent`, `IssuesEvent`, etc.).
* Displays readable event descriptions.
* Implements local caching to reduce unnecessary API requests.
* Shows remaining GitHub API rate limit.
* Built with plain Node.js (no external libraries).

## 🛠 Installation

```bash
git clone https://github.com/rizkilabs/github-user-activity-cli.git
cd github-user-activity-cli
npm install
npm link  # Makes the CLI globally accessible as `github-activity`
```

> Note: You might need to use `sudo npm link` if you encounter permission issues on macOS/Linux.

## 💻 Usage

Run the CLI:

```bash
github-activity
```

Then follow the interactive prompt:

```
Masukkan username GitHub: kamranahmedse
Filter event type (misal: PushEvent)? Tekan Enter jika tidak ingin filter:
```

Example output:

```
🔍 Mengambil data aktivitas...

📌 Aktivitas terbaru dari kamranahmedse:
- Pushed 3 commit(s) to kamranahmedse/developer-roadmap
- Opened issue in kamranahmedse/developer-roadmap
- Starred kamranahmedse/developer-roadmap

📉 Sisa limit API GitHub: 59/60
```

## 📂 Cache

* Activity data is stored in `data/activity.json`.
* Cached for 5 minutes to minimize GitHub API usage.

## 📄 GitHub API Used

* `https://api.github.com/users/:username/events`
* `https://api.github.com/rate_limit`

## 🧪 Testing

You can test different usernames and event filters. Try:

* `kamranahmedse`
* `torvalds`
* `gaearon`

Also test invalid usernames to check error handling.

## 🧰 Requirements

* Node.js v14 or newer
* Internet connection

## 📌 Future Improvements

* Export results to JSON or markdown.
* Add GitHub token support to increase API limits.
* Filter by repository name.
* Support pagination for more events.

## 👨‍💻 Author

**Mochamad Rizki** <br>
Website: [rizkilabs.com](https://rizkilabs.com) <br>
Email: [rizkilabs.dev@gmail.com](mailto:rizkilabs.dev@gmail.com) <br>
LinkedIn: [linkedin.com/in/rizkilabs](https://linkedin.com/in/rizkilabs)

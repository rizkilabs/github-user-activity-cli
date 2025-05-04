// utils.js
const fs = require("fs");
const path = require("path");

function saveToFile(filename, data) {
  fs.writeFileSync(path.join(__dirname, filename), JSON.stringify(data, null, 2), "utf-8");
}

function readFromFile(filename) {
  const filePath = path.join(__dirname, filename);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

module.exports = {
  saveToFile,
  readFromFile,
  formatDate,
};

const { exec } = require("child_process");

exports.auditToken = (req, res) => {
  exec("slither ./contracts/Token.sol --json audit.json", (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: "Audit çalıştırılamadı", details: stderr });
    }
    const fs = require("fs");
    fs.readFile("audit.json", "utf8", (err, data) => {
      if (err) return res.status(500).json({ error: "Audit sonucu okunamadı" });
      res.json({ report: JSON.parse(data) });
    });
  });
};
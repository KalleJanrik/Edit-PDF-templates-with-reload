const PROXY_CONFIG = [
  {
    context: [
      "/api","/templates"
    ],
    target: "https://localhost:7225",
    secure: false
  }
]

module.exports = PROXY_CONFIG;

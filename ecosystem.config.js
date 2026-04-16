module.exports = {
  apps: [
    {
      name: "nilmani",
      script: "node",
      args: ".next/standalone/server.js",
      cwd: "/var/www/nilmani",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};

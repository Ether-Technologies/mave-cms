module.exports = {
  apps: [
    {
      name: "mave-cms",
      script: "npm",
      args: "start",
      cwd: "/var/www/cms/mave-cms",
      env: {
        NODE_ENV: "production",
        PORT: 3007,
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/var/www/mave-cms/logs/pm2-error.log",
      out_file: "/var/www/mave-cms/logs/pm2-out.log",
      merge_logs: true,
    },
  ],
};

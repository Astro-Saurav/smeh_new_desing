// PM2 Ecosystem Configuration — Manav Rachna Time
// Usage: pm2 start ecosystem.config.js --env production

module.exports = {
  apps: [
    {
      name: 'mrt-api',
      script: './backend/src/server.js',
      cwd: '/var/www/mrt',
      instances: 'max',          // Cluster mode: uses all CPU cores
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: process.env.PM2_MAX_MEMORY || '2G',
      env: {
        NODE_ENV: 'development',
        PORT: 8080
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/www/mrt/logs/pm2-error.log',
      out_file: '/var/www/mrt/logs/pm2-out.log',
      merge_logs: true,
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    },
    {
      name: 'mrt-workers',
      script: './backend/src/workers/runner.js',
      cwd: '/var/www/mrt',
      instances: 1,              // Workers run as a single instance
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: process.env.PM2_MAX_MEMORY || '512M',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/www/mrt/logs/pm2-workers-error.log',
      out_file: '/var/www/mrt/logs/pm2-workers-out.log',
      merge_logs: true
    },
    {
      name: 'mrt-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/mrt/frontend',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: process.env.PM2_MAX_MEMORY || '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/www/mrt/logs/pm2-frontend-error.log',
      out_file: '/var/www/mrt/logs/pm2-frontend-out.log',
      merge_logs: true
    }
  ]
}

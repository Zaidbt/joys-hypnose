module.exports = {
  apps: [{
    name: 'joys-hypnose',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: [
      'public/uploads'
    ],
    watch_delay: 1000,
    ignore_watch: [
      'node_modules',
      '.next',
      '.git',
      'node_modules/**',
      '**/*.log'
    ],
    watch_options: {
      followSymlinks: false,
      usePolling: true,
      interval: 1000
    },
    max_memory_restart: '1G'
  }]
}; 
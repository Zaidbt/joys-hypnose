module.exports = {
  apps: [
    {
      name: 'joys-hypnose',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
        HOSTNAME: '0.0.0.0',
        NEXTAUTH_URL: 'https://joyshypnose-therapies.com',
        NEXTAUTH_SECRET: 'yzq8br7GBd86j4oJm6gk1IzqpBSHKy3NGOzKqmar1sk=',
        ADMIN_EMAIL: 'knzjoyce@gmail.com',
        MONGODB_URI: 'mongodb+srv://zvoicecraft:CO4MHyZBCwI3GTSV@instafeed.f1cdi.mongodb.net/joyshypnose?retryWrites=true&w=majority&appName=Instafeed'
      },
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
}

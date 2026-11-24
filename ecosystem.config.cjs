module.exports = {
  apps: [
    {
      name: 'mahilo-web',
      cwd: './backend',
      script: 'dist/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5093,
        CLIENT_URL: 'https://mahilo.sriddha.com',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5093,
        CLIENT_URL: 'https://mahilo.sriddha.com',
      },
    },
  ],
};

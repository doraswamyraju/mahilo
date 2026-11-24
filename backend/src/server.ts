import app from './app.js';
import { config } from './config/index.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌸 MAHILO API Server is running on port ${PORT}`);
  console.log(`🛍️  Marketplace First: Products & Services`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`✨ Environment: ${config.nodeEnv}`);
  console.log(`====================================================`);
});

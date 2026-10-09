require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db'); 

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n Clinic Appointment System API`);
    console.log(`   Server running on: http://localhost:${PORT}`);
    console.log(`   Health check:      http://localhost:${PORT}/api/health`);
    console.log(`   Environment:       ${process.env.NODE_ENV || 'development'}\n`);
  });
});

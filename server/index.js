import app from './app.js';
import connectDb from './utils/dbConnect.js';

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Server shutting down due to Uncaught Expception');
  process.exit(1);
});

connectDb();
const server = app.listen(process.env.PORT, () => {
  console.log(`server Is working On http://localhost:${process.env.PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Server shutting down due to Unandled Rejection ');
  server.close(() => {
    process.exit(1);
  });
});

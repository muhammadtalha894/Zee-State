import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    const dbConntection = await mongoose.connect(process.env.DB_URI);
    console.log('server is working');
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;

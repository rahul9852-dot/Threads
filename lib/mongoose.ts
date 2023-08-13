import mongoose from 'mongoose';

let isConnected = false;
// variable to check if mongoose is connected.

export const connectionToDb = async () => {
  mongoose.set('strictQuery', true);
  if(!process.env.MONGODB_URL) {
    console.log("MONGODB_URL not found");
  } 
  if(isConnected){
    console.log('Already connected to MongoDB');
  }
  try{
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
  }catch(error){
    console.log(error);
  }
}


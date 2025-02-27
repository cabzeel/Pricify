import mongoose from "mongoose";

let isConnected = false //tracks the connection status to the database;

export const connectToDB = async () => {
   mongoose.set('strictQuery', true);

   if(!process.env.MONGODB_URI) return console.log('MONGODB_URI is not defined');

   if(isConnected) return console.log('using existing database connection');

   try {
      await mongoose.connect(process.env.MONGODB_URI);

      isConnected = true;

   } catch (error) {
      console.log(error)
   }
}
import mongoose from "mongoose";
//this is the database connection which is used on api/products
export function mongooseConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    const uri = process.env.MONGODB_URI ;
    return mongoose.connect(uri);
  }
} 
import mongoose from 'mongoose';


const { Schema } = mongoose;


const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
});


export default mongoose.model('User', userSchema);



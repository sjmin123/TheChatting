import mongoose from 'mongoose';


const { Schema } = mongoose;


const chatSchema = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true },
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  to: { type: Schema.Types.ObjectId, ref: 'User' },
  isRead: { type: Boolean, required: true },
});


export default mongoose.model('Chat', chatSchema);

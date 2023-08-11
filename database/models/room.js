import mongoose from 'mongoose';


const { Schema } = mongoose;


const roomSchema = new Schema({
  chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
  audiences: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});


export default mongoose.model('Room', roomSchema);

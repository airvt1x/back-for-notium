import mongoose from "mongoose";


const NoteSchema = new mongoose.Schema({
    note_data: {
        type: Map,
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    prority: {
        type: Number
    },
    },
    {
        timestamps:true,
    }
);

export default mongoose.model('Note', NoteSchema);
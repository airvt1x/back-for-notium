import NoteModel from "../models/Note.js"

export const getNotes = async(req,res)=>{
    const user_id = req.userId
    try {
        const notes = await NoteModel.find({
            user: user_id
        });

        res.json(notes);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить заметки',
        });
        
    }
}

export const getOne = async(req,res)=>{
    try {
        const noteId = req.params.id;
        const user_id = req.userId
        NoteModel.findOne(
            {
            user: user_id,
            _id: noteId
        }).then(note => {res.json(note)});
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить заметки',
        });
        
    }
}

export const remove = async(req,res)=>{
    try {
        const noteId = req.params.id;

        await NoteModel.findOneAndDelete({
            _id:noteId,
        }).then(note => {res.json({success:true})});

        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
        
    }
}

export const create = async (req, res) => {
    try {
        const doc = new NoteModel({
            note_data: req.body.note_data,
            priority: req.body.priority,
            user: req.userId,
        });

        const note = await doc.save();

        res.json(note);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать заметку',
        });
        
    }
};

export const update = async(req, res) => {
    try {
        const noteId = req.params.id;
        
        await NoteModel.updateOne({
            _id: noteId,
        },
        {
            note_data: req.body.note_data,
            priority: req.body.priority,
            user: req.userId,
        },
        );

        res.json({
            success: true,
        })
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось обновить заметку',
        })
        
    }
}

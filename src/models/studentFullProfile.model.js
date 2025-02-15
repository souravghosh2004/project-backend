import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const studentFullProfileSchema = new Schema(
    {
        studentDetails:{
            type:mongoose.Types.ObjectId,
            ref:"Student"
        },
        tenth:{
            type:Object
        },
        twelfth:{
            type:Object
        },
        graduation:{
            type:Object
        },
        postGraduation:{
            type:Object
        },
        cv:{
            type:String
        }

    }
)

const StudentFullProfile = mongoose.model("StudentFullProfile",studentFullProfileSchema);
export default StudentFullProfile;

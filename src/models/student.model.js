import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const studentSchema = new Schema(
    {
        studentMail : {
            type: String,
            required: true,
            unique: true
        },
        studentCode : {
            type: String,
            required: true
        },
        studentName : {
            type: String,
            required: true
        },
        password : {
            type:String,
            required: true
        },
        contactNumber : {
            type: String,
        },
        studentStream : {
            type: String,
            required:true
        },
        profilePic:{
            type:String
        },
        "appliedJobs": [ // New field for job IDs
            {
                type: Schema.Types.ObjectId,
                ref: 'Job', // Reference the 'Job' model if it exists
            },
        ],

    }
)

const Student = mongoose.model("Student",studentSchema);

export default Student;

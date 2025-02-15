import mongoose from "mongoose";

const Schema = mongoose.Schema;
const teacherSchema = new Schema(
    {
        teacherMail:{
            type:String,
            required:true,
            unique:true
        },
        teacherName:{
            type:String,
            required:true
        },
        teacherPassword:{
            type:String,
            required:true
        },
        teacherDepatment:{
            type:String,
            required:true
        }

    }
)

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
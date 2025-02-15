import mongoose from "mongoose";

const Schema = mongoose.Schema;

const jobSchema = new Schema (
    {
        "companyName":{
            type:String,
            required:true,
        },
        "location":{
            type:String
        },
        "jobRole":{
            type:String,
            required:true,
        },
        "skills": {
            type: String,
            required: true,
            trim: true,
        },
        "salary":{
            type:String
        },
        "description":{
            type:String,
        },
        "applyLink":{
            type:String
        },
        "eligibility": {
            type: [String],
            required: true,
        },
        "appliedStudent":[
            {
                type:Schema.Types.ObjectId,
                ref:"Student",
            },
        ],
        "creator":{
            type:Schema.Types.ObjectId,
            ref:"Teacher",
            //required:true,
        },
    },{timestamps:true}
)

const Job = mongoose.model("Job", jobSchema);

export default Job;
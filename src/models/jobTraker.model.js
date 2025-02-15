import mongoose from "mongoose";
const Schema = mongoose.Schema;

const jobTrackerSchema = new Schema(
    {
        "jobId" : {
            type: String,
            required: true,
            unique: true
        },
        "password" : {
            type: String,
            required: true
        },
        "jobDetails" : {
            type : Schema.Types.ObjectId,
            ref: "Job",
            unique:true
        },
        "resumeSelect" : [ 
            {
                type : Schema.Types.ObjectId,
                ref : "Student"
            }
        ],
        "resumeRoundCompleted": {
            type: Boolean,
            default: false
        },
        "firstRound" : [
            {
                type: Schema.Types.ObjectId,
                ref: "Student"
            }
        ],
        "firstRoundCompleted": {
            type: Boolean,
            default: false
        },
        "secondRound" : [
            {
                type : Schema.Types.ObjectId,
                ref: "Student"
            }
        ],
        "secondRoundCompleted": {
            type: Boolean,
            default: false
        },
        "thirdRound" : [
            {
                type: Schema.Types.ObjectId,
                ref: "Student"
            }
        ],
        "thirdRoundCompleted": {
            type: Boolean,
            default: false
        },
        "fourthRound" : [
            {
                type: Schema.Types.ObjectId,
                ref: "Student"
            }
        ],
        "fourthRoundCompleted": {
            type: Boolean,
            default: false
        },
        "finalRound" : [
            {
                type: Schema.Types.ObjectId,
                ref: "Student"
            }
        ],
        "finalRoundCompleted": {
            type: Boolean,
            default: false
        }
    }
);

const JobTracker = mongoose.model('JobTracker', jobTrackerSchema);

export default JobTracker;


import app from "./app.js";
import connectDB from "./db/connectDB.js";
import dotenv from "dotenv";
dotenv.config({
    path: "./env"
});


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 4000, () => {
        console.log(`Server is running on port ${process.env.PORT || 4000}`);
    })
    app.on("error", (err) =>{
        console.error("ERR",err);
        throw err;
    })
})
.catch((error) =>{
    console.error("Sorry database connection failed!!!!!! ",error);

})



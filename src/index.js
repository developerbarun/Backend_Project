import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from './app.js'

dotenv.config({
    path : './env'
})

connectDB()
.then(() => {

    app.on("Error is : ",(error) => {
        console.log("Error in express : ",error);
        throw error
    })

    app.listen(process.env.PORT|| 8000,() => {
        console.log(`Server is up on ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("DB connection Failed",err);
}
)
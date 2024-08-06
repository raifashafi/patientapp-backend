const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const loginModel = require("./models/admin")


const app = express()
app.use(cors())


mongoose.connect("mongodb+srv://raifashafi:raifashafi@cluster0.tznb7.mongodb.net/patientDB?retryWrites=true&w=majority&appName=Cluster0")
app.use(express.json())
app.get("/test", (req, res) => {
    res.json({ "status": "success" })
})

app.post("/adminSignin", (req, res) => {

    let input = req.body
    let hashedpassword = bcrypt.hashSync(input.password, 10)
    // console.log(hashedpassword)

    input.password = hashedpassword
    console.log(input)

    let result = new loginModel(input)
    result.save()
    res.json({ "status": "success" })
})
app.listen(3030, () => {
    console.log("server started")
})
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")
const loginModel = require("./models/admin")
const doctorModel = require("./models/doctor")


const app = express()
app.use(cors())


mongoose.connect("mongodb+srv://raifashafi:raifashafi@cluster0.tznb7.mongodb.net/patientDB?retryWrites=true&w=majority&appName=Cluster0")
app.use(express.json())
app.get("/test", (req, res) => {
    res.json({ "status": "success" })
})

app.post("/adminSignup", (req, res) => {

    let input = req.body
    let hashedpassword = bcrypt.hashSync(input.password, 10)
    // console.log(hashedpassword)

    input.password = hashedpassword
    console.log(input)

    let result = new loginModel(input)
    result.save()
    res.json({ "status": "success" })
})
app.post("/adminSignin",(req,res)=>{
    let input=req.body
    let result=loginModel.find({username:input.username}).then(
        (response)=>{
            if (response.length>0) {
                const validator=bcrypt.compareSync(input.password,response[0].password)
                if (validator) {
                  //  res.json({ "status": "success" })
                  jwt.sign({email:input.username},"patient-app",{expiresIn:"1d"},
                    (error,token)=>{
                        if (error) {
                            res.json({ "status": "token creation failed" })
                        } else {
                            res.json({ "status": "success","token":token })
                        }
                    })
                } else {
                    res.json({ "status": "wrong password" })
                }
            } else {
                res.json({ "status": "username doesnt exist" })
            }
        }
    ).catch()
})
app.post("/addDoctor",(req,res)=>{

    let input=req.body
    let token=req.headers.token
    jwt.verify(token,"patient-app",(error,decoded)=>{
        if (decoded && decoded.email) {
            let result=new doctorModel(input)
            result.save()
            res.json({ "status": "success" })
        } else {
            res.json({ "status": "invalid authentication" })
        }
    })


})
app.listen(3030, () => {
    console.log("server started")
})
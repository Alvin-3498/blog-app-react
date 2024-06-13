const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcryptjs = require("bcryptjs")//For password encryption
const jwt = require("jsonwebtoken")//For generating tokens
const blog = require("./models/blog")
const {blogmodel} = require("./models/blog")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://alvinkonukudy8:Alvin7736@cluster0.s7czq8v.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword = async(password) => {
    const salt = await bcryptjs.genSalt(10)
    return bcryptjs.hash(password,salt)
}

app.post("/signup",async(req,res) => {
    let input = req.body
    let HashedPassword = await generateHashedPassword(input.password)
    console.log(HashedPassword)
    input.password = HashedPassword
    let blog = new blogmodel(input)
    blog.save()
    res.json({"status":"Success"})
})

app.post("/signin",(req,res) => {
    let input = req.body
    blogmodel.find({"email":req.body.email}).then(
        (response) => {
            if (response.length > 0) {
                let dbpassword = response[0].password
                console.log(dbpassword)
                bcryptjs.compare(input.password,dbpassword,(error,isMatch) => {
                    if (isMatch) {
                        jwt.sign({email:input.email},"blog-app",{expiresIn:"1d"},
                            (error,token) => {
                            if (error) {
                                res.json({"status":"Unable to generate token"})
                            } else {
                                res.json({"status":"success","userid":response[0]._id,"token":token})
                            }
                        })
                    } else {
                        res.json({"status":"Incorrect Password"})
                    }
                })
            } else {
                res.json({"status":"user not found"})
            }
        }
    ).catch()
})

app.listen(8080,() => {
    console.log("Server started")
})
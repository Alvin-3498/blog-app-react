const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcryptjs = require("bcryptjs")//For password encryption
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

app.listen(8080,() => {
    console.log("Server started")
})
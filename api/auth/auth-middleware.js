const db = require("../../data/dbConfig")
module.exports = validation

async function validation(req, res, next) {


    try {
        let user = req.body.username
        let username = await db("users").select("username").where("username", user).first()
        console.log(!req.body.username, !req.body.password)

        if (!req.body.username || !req.body.password || !req.body) {
            return res.status(401).json({ message: "username and password required" })
        }

        if (username) {
            return res.status(401).json({ message: "username taken" })
        }
        next()


    } catch (error) {
        res.status(400).json({ message: "username and password required" })
    }
} 
const jwt = require("jsonwebtoken")

class Middleware{
    static authControl(req,res,next){
        try{
            let token = req.headers["authorization"];
            if(typeof token !== "undefined"){
                token = token.split(" ")[1];
                jwt.verify(token,process.env.ADMIN_SECRET_KEY,(err,user)=>{
                    if(err){
                        return res.status(401).send({message:"Unauthentication."})
                    }else{
                        next()
                    }
                })
            }else{
                return res.status(401).send({message:"Unauthentication."})
            }
        }catch (e) {
            res.status(500).send("Something gone wrong.")
        }

    }
}

module.exports = Middleware
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Validator = require('validatorjs');
const slugify = require('slugify')

//Models
const Admin = require("../models/Admin")
const Songs = require("../models/Songs")

class AdminController{
    static login(req,res){
        try{
            let validator = new Validator(req.body,{
                "email": "required",
                "password":"required"
            },{
                "required.email" : "Email fiel can't be empty",
                "required.password": "Password field can't be empty"
            })

            if(validator.passes()){
                const {email, password} = req.body
                Admin.findOne({email},(error,admin)=>{
                    if(admin){
                        if(bcrypt.compareSync(password, admin.password)){
                            jwt.sign({admin},process.env.ADMIN_SECRET_KEY,{expiresIn:"1w"},(err,token)=>{
                                if(err){
                                    return res.status(500).send("Something wrong.")
                                }
                                return res.status(200).send({ token:token,admin:admin})
                            })
                        }else{
                            return res.status(401).send({message:'Wrong password.'})
                        }
                    }else{
                       return  res.status(401).send({message:'Match not found.'})
                    }
                })
            }else{
                return res.status(400).json({message:validator.errors.all()})
            }
        }catch (e) {
            return res.status(500).json({message:"Something gone wrong.",is_error:true})
        }
    }

    static async songs(req,res){
        let songs = await Songs.find()
        if(songs.length > 0){
            return res.status(200).json({is_error:false, message:"Toplamda "+songs.length+" adet değer bulunmuştur.",data:songs})
        }else{
            return res.status(200).json({is_error:false, message:"Değer bulunamamıştır."}) 
        }
    }

    static songs_add(req,res){
        try{
            let validator = new Validator(req.body,{
                "name": "required",
                "content":"required",
                "descriptions":"required",
                "keywords":"required"
            },{
                "required.name" : "name fiel can't be empty",
                "required.content": "Content field can't be empty",
                "required.descriptions": "Descriptions field can't be empty",
                "required.keywords": "Keywords field can't be empty"
            })

            if(validator.passes()){
                const {name,content,descriptions,keywords} = req.body
                let song = new Songs();
                song.name = name;
                song.slug = slugify(name);
                song.content = content;
                song.descriptions = descriptions;
                song.keywords = keywords;
                song.save();
                return res.status(200).json({is_error:false, message:"Şarkı başarılı bir şekilde kaydedilmiştir.",data:song})
            }else{
                return res.status(400).json({message:validator.errors.all()})
            }
            
        }catch(e){  
            return res.status(500).json({message:"Something gone wrong.",is_error:true})
        }
    }

    static songs_delete(req,res){
        try{
            let validator = new Validator(req.body,{
                "_id": "required"
            },{
                "required._id" : "Something gone wrong."
            })

            if(validator.passes()){
                const {_id} = req.body
                Songs.findByIdAndDelete(_id).catch((e)=>{ return res.status(500).json({message:"Something gone wrong.",is_error:true}) }).then(()=>{
                    Songs.find().then((response)=>{
                        return res.status(200).json({is_error:false, message:"Şarkı başarılı bir şekilde silindi.",songs:response})
                    })
                })
            }else{
                return res.status(400).json({message:validator.errors.all()})
            }
            
        }catch(e){  
            return res.status(500).json({message:"Something gone wrong.",is_error:true})
        }
    }

    static async songs_update(req,res){
        try{
            let validator = new Validator(req.body,{
                "_id":"required",
                "name": "required",
                "content":"required",
                "descriptions":"required",
                "keywords":"required"
            },{
                "required.name" : "Name fiel can't be empty",
                "required._id" : "Something gone wrong",
                "required.content": "Content field can't be empty",
                "required.descriptions": "Descriptions field can't be empty",
                "required.keywords": "Keywords field can't be empty"
            })

            if(validator.passes()){
                const {_id,name,content,descriptions,keywords} = req.body
                let song = await Songs.findById(_id);
                song.name = name;
                song.slug = slugify(name);
                song.content = content;
                song.descriptions = descriptions;
                song.keywords = keywords;
                song.save().catch((e)=>{return res.status(500).json({message:"Something gone wrong.",is_error:true})});
                return res.status(200).json({is_error:false, message:"Şarkı başarılı bir şekilde güncellenmiştir..",data:song})
            }else{
                return res.status(400).json({message:validator.errors.all()})
            }
            
        }catch(e){  
            return res.status(500).json({message:"Something gone wrong.",is_error:true})
        }
    }

    static songs_edit(req,res){
        try{
            Songs.findById(req.params.id).then((response)=>{
                if(response){
                    return res.status(200).json({is_error:false,data:response})
                }else{
                    return res.status(404).json({is_error:false, message:"404 Not Found"}) 
                }
            })
        }catch(e){
            return res.status(500).json({message:"Something gone wrong.",is_error:true})
        }
    }
        
}

module.exports = AdminController
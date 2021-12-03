const cheerio = require('cheerio')
const request = require('request')
const slugify = require('slugify')
const Songs = require("../models/Songs")
const Validator = require('validatorjs');

class HomeController{
    static home(req,res){
        Songs.count().exec(function (err, count) {
            // Get a random entry
            var random = Math.floor(Math.random() * count)
            
            // Again query all users but only fetch one offset by our random #
            Songs.find().limit(20).skip(random).exec(
                function (err, result) {
                // Tada! random user
                res.status(200).json({is_error:false,data:result}) 
            })
        })
    }

    static async single_song(req,res){
        let song = await Songs.findOne({_id: req.params.id, slug: req.params.slug})
        return await res.status(200).json({is_error:false,data:song})
    }

    static async search(req,res){
        try{
            let validator = new Validator(req.body,{
                "search": "required"
            },{
                "required.search" : "Please search sometihing...",
            })
    
            if(validator.passes()){
                let song = await Songs.find({name: {$regex: req.body.search , $options:"i"}})
                return await res.status(200).json({is_error:false,data:song})
            }else{
                return res.status(400).json({is_error:true,message:validator.errors.all()})
            }
        }catch (e) {
            return res.status(500).json({message:"Something gone wrong.",is_error:true})
        }
        
    }

    static get_data(req,res){
        request("http://www.akormerkezi.net/sibel-can-melekler-agliyordu-akor_sarki-vjrdfp.html",(error,response,html)=>{
            if(!error && response.statusCode == 200){
                const $ = cheerio.load(html)

                $("#printsong_box div").remove();
                $("#printsong_box font").remove();
                $("#printsong_box hr").remove();
                $("#printsong_box b").remove();
                $('#printsong_box').contents().filter(function() {
                    if (this.nodeType == 8) {
                      $(this).remove()
                    }
                });
                let content = $('#printsong_box').html();
                let keywords = $('meta[name="keywords"]').attr("content");
                let description = $('meta[name="description"]').attr("content");
                content = content.replaceAll("&nbsp;"," ");
                content = content.replaceAll("<br>","\n");
                content = content.replace("AkorMerkezi.com'da yayınlanmıştır","")
                content = content.replace("http://www.akormerkezi.com","")
                content = content.trim();
                content = content.split("\n");
                content.pop();
                content = content.join("\n")

                return res.send(content)
            }
        })
    }

    static bot(req,res){
        request("http://www.akormerkezi.net/soz_nota.asp",(error,response,html)=>{
            if(!error && response.statusCode == 200){
                const $ = cheerio.load(html)
                $(".i4 a").each(function(i, elem) {
                    request($(elem).attr("href"),(error,response,html)=>{
                        if(!error && response.statusCode == 200){
                            const $ = cheerio.load(html)
                            $("#listesatir a").each(function(i,elem){
                                request($(elem).attr("href"),(error,response,html)=>{
                                    if(!error && response.statusCode == 200){
                                        const $ = cheerio.load(html)
                                        //console.log($(".ictaraf ul").children().first().find("a").attr("href"))
                                        request($(".ictaraf ul").children().first().find("a").attr("href"),(error,response,html)=>{
                                            if(!error && response.statusCode == 200){
                                                const $ = cheerio.load(html)
                                                if($("#listesatir") === null){
                                                    //TODO if response is null, do something 
                                                    console.log("hacı bu null")
                                                }else{
                                                    $("#listesatir a").each((i,elem)=>{
                                                        request($(elem).attr("href"),(error,response,html)=>{
                                                            if(!error && response.statusCode == 200){
                                                                const $ = cheerio.load(html)
                                                                let name = $(".i3").text();
                                                                $("#printsong_box div").remove();
                                                                $("#printsong_box font").remove();
                                                                $("#printsong_box hr").remove();
                                                                $("#printsong_box b").remove();
                                                                $('#printsong_box').contents().filter(function() {
                                                                    if (this.nodeType == 8) {
                                                                        $(this).remove()
                                                                    }
                                                                });
                                                                let content = $('#printsong_box').html();
                                                                let keywords = $('meta[name="keywords"]').attr("content");
                                                                let description = $('meta[name="description"]').attr("content");
                                                                content = content.replaceAll("&nbsp;"," ");
                                                                content = content.replaceAll("<br>","\n");
                                                                content = content.replace("AkorMerkezi.com'da yayınlanmıştır","")
                                                                content = content.replace("http://www.akormerkezi.com","")
                                                                content = content.trim();
                                                                content = content.split("\n");
                                                                content.pop();
                                                                content = content.join("\n");
                                                                let song = new Songs();
                                                                song.name = name;
                                                                song.slug = slugify(name);
                                                                song.content = content;
                                                                song.descriptions = description;
                                                                song.keywords = keywords;
                                                                song.save();
                                                                console.log("kayıt ettim",song)
                                                            }
                                                        })
                                                    })
                                                }
                                                
                                            }
                                        })
                                    }
                                })
                            })
                        }
                    }) 
                });
            }
        })
    }
}

module.exports = HomeController
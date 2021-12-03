const express = require("express");
const router = express.Router();


const HomeController = require("../controllers/HomeController")
const AdminController = require("../controllers/AdminController")

//Middlewares
const Middlewares = require("../middlewares/Middlewares")



router.post("/admin/login", AdminController.login)
router.get("/admin/songs",Middlewares.authControl, AdminController.songs)
router.post("/admin/songs/create",Middlewares.authControl, AdminController.songs_add)
router.post("/admin/songs/delete",Middlewares.authControl, AdminController.songs_delete)
router.post("/admin/songs/update",Middlewares.authControl, AdminController.songs_update)
router.get("/admin/songs/:id",Middlewares.authControl, AdminController.songs_edit)

/* User Routes */
router.get("/",HomeController.home)
router.post("/search",HomeController.search)
router.get("/get-data",HomeController.get_data)
router.get("/bot",HomeController.bot)
router.get("/:slug/:id",HomeController.single_song)

module.exports = router;
const express = require("express");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");



router.post("/roadmap/thumbnail", (req, res) => {
    console.log('asdfasdf')
});

router.post("/skill/thumbnail", async (req, res) => {
    console.log('asdf')
    const result = await cloudinary.uploader.upload(req.body.image, {
        folder: "skills"
    })
    console.log(result);
})

module.exports = router;
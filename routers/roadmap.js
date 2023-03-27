const router = require("express").Router();
const Roadmap = require("../models/Roadmap");
const cloudinary = require("../utils/cloudinary");

router.get("/one/:id", async (req, res) => {
    const _id = req.params.id;
    try
    {
        await Roadmap.findOne({ _id: _id })
        .then((foundRoadmap) => {
            if(foundRoadmap)
            {
                return res.status(200).send({
                    roadmap: foundRoadmap
                });
            }
            else
            {
                return res.status(500).send({
                    message: `There is no ${_id} roadmap in DB.`
                });
            }
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send({
                message: "Server Error"
            })
        })
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).send({
            message: "Server Error"
        })
    }
})

router.get("/all", async (req, res) => {
    try
    {
        await Roadmap.find({})
        .then((foundRoadmaps) => {
            return res.status(200).send({
                roadmaps: foundRoadmaps
            })
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).send({
                message: "Server Error"
            });
        });
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).send({
            message: ""
        })
    }
});

router.post("/create", async (req, res) => {
    try
    {
        const {
            name,
            skills,
            framework,
            computerLanguage,
            image
        } = req.body;

        let skillIds = [];
        for(let index = 0; index < skills.length; ++index)
        {
            skillIds.push(skills[index]._id);
        }

        let publicId = "";
        let secureUrl = "";

        if(image !== null)
        {
            const cloudinaryResult = await cloudinary.uploader.upload(image, {
                folder: "roadmaps"
            });
            publicId = cloudinaryResult.public_id;
            secureUrl = cloudinaryResult.secure_url;
        }

        await Roadmap.create({
            name: name,
            computerLanguage: computerLanguage,
            framework: framework,
            skills: skillIds,
            imagePublicId: publicId,
            imageSecureUrl: secureUrl
        })
        .then((createdRoadmap) => {
            return res.status(200).send({
                _id: createdRoadmap._id
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).send({
                message: "Server Error"
            });
        });
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).send({
            message: "Server Error"
        })
    }
});


module.exports = router;
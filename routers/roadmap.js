const router = require("express").Router();
const Skill = require("../models/Skill");
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

        //let skillIds = [];
        //for(let index = 0; index < skills.length; ++index)
        //{
        //    skillIds.push(skills[index]._id);
        //}

        let editedSkills = [];
        for(let index = 0; index < skills.length; ++index)
        {
            editedSkills.push({
                _id: skills[index]._id,
                imagePublicId: skills[index].imagePublicId,
                imageSecureUrl: skills[index].imageSecureUrl,
                name: skills[index].name
            });
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
            skills: editedSkills,
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

router.post("/edit/:id", async(req, res) => {
    const _id = req.params.id;
    try
    {
        const {
            name,
            computerLanguage,
            framework,
            skills,
            image,
            isChanged
        } = req.body;

        let publicId = "";
        let secureUrl = "";

        await Roadmap.findOne({ _id: _id })
        .then((foundRoadmap) => {
            publicId = foundRoadmap.imagePublicId;
            secureUrl = foundRoadmap.imageSecureUrl;
        });

        if(isChanged)
        {
            cloudinary.uploader.destroy(publicId, function(result){
                console.log(result);
            });

            if(image !== null)
            {
                const cloudinaryResult = await cloudinary.uploader.upload(image, {
                    folder: "roadmaps"
                });

                publicId = cloudinaryResult.public_id;
                secureUrl = cloudinaryResult.secure_url;
            }
            else
            {
                publicId = "";
                secureUrl = "";
            }
        }

        let editedSkills = [];

        for(let index = 0; index < skills.length; ++index)
        {
            await Skill.findOne({ _id: _id })
            .then((foundSkill) => {
                editedSkills.push({
                    _id: foundSkill._id,
                    imagePublicId: foundSkill.imagePublicId,
                    imageSecureUrl: foundSkill.imageSecureUrl,
                    name: foundSkill.name
                })
            });
        }

        await Roadmap.findOneAndReplace({ _id: _id }, {
            name: name,
            computerLanguage: computerLanguage,
            framework: framework,
            skills: editedSkills,
            imagePublicId: publicId,
            imageSecureUrl: secureUrl
        })
        .then((editedRoadmap) => {
            return res.status(200).send({
                _id: editedRoadmap._id
            });
        })
        .catch((err) => {
            console.error(err);
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
});


module.exports = router;
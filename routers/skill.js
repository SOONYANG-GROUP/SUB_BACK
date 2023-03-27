const router = require("express").Router();
const Skill = require("../models/Skill");
const cloudinary = require("../utils/cloudinary");

router.get("/all", async (req, res) => {
    try
    {
        await Skill.find({})
        .then((foundSkills) => {
            return res.status(200).send({
                skills: foundSkills
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
            message: ""
        })
    }
});

router.get("/one/:id", async (req, res) => {
    const _id = req.params.id;
    try
    {
        await Skill.findOne({_id: _id})
        .then((foundSkill) => {
            if(foundSkill)
            {
                return res.status(200).send({
                    skill: foundSkill
                })
            }
            else
            {
                return res.status(500).send({
                    message: `${id} 관련 데이터가 존재하지 않습니다.`
                })
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).send({
                message: "Server Error"
            })
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
            references,
            studyTip,
            image
        } = req.body;

        let publicId = "";
        let secureUrl = "";

        if(image !== null)
        {
            const cloudinaryResult = await cloudinary.uploader.upload(image, {
                folder: "skills"
            });
            publicId = cloudinaryResult.public_id;
            secureUrl = cloudinaryResult.secure_url;
        }
        await Skill.create({
            name: name,
            references: references,
            studyTip: studyTip,
            imagePublicId: publicId,
            imageSecureUrl: secureUrl
        })
        .then((createdSkill) => {
            return res.status(200).send({
                _id: createdSkill._id
            })
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


router.post("/edit/:id", async (req, res) => {
    const _id = req.params.id;
    try
    {
        const {
            name,
            studyTip,
            references,
            isChanged,
            image
        } = req.body;

        let publicId = "";
        let secureUrl = "";

        await Skill.findOne({ _id: _id })
        .then((foundSkill) => {
            publicId = foundSkill.imagePublicId;
            secureUrl = foundSkill.imageSecureUrl;
        });


        if(isChanged)
        {
            cloudinary.uploader.destroy(publicId, function(result){
                console.log(result);
            });

            if(image !== null)
            {
                const cloudinaryResult = await cloudinary.uploader.upload(image, {
                    folder: "skills"
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

        await Skill.findOneAndReplace({ _id: _id }, {
            name: name,
            studyTip: studyTip,
            references: references,
            imagePublicId: publicId,
            imageSecureUrl: secureUrl
        }).then((editedSkill) => {
            return res.status(200).send({
                _id: editedSkill._id
            })
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
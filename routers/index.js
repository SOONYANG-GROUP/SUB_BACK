const router = require("express").Router();

router.get("/", (req, res) => {
    return res.status(200).send({
        message: "똑똑한 재광님과 형일님의 역작"
    })
})

module.exports = router;
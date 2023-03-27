const router = require("express").Router();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: process.env.ORG_KEY,
    apiKey: process.env.GPT_API_KEY
});
const openai = new OpenAIApi(configuration);
const role = "user";
const content = "초보 개발자 5명이 14일동안 개발할 수 있는 재미있고 유용한 사이드 프로젝트 하나만 추천해줘"

router.post("/project/idea", async (req, res) => {
    try
    {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": role, "content": content }
            ]
        });
        return res.status(200).send({
            data: response.data
        });
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).send({
            message: "Server Error"
        });
    }
});

module.exports = router;
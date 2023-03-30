const router = require("express").Router();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: process.env.ORG_KEY,
    apiKey: process.env.GPT_API_KEY
});
const openai = new OpenAIApi(configuration);
const role = "user";
const ideaContent = "초보 개발자 5명이 14일동안 개발할 수 있는 재미있고 유용한 사이드 프로젝트 하나만 추천해줘"

router.post("/project/idea", async (req, res) => {
    try
    {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": role, "content": ideaContent }
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

router.post("/skill/problem", async (req, res) => {
    const { skillName } = req.body;
    console.log(skillName)
    const skillContent = `${skillName}을 이용해 초보자가 풀 수 있는 문제 1개 문제를 150개 단어 내로 알려줘. 다만, 문제에 대한 상세 설명, 구현 방법, 푸는 방법, 힌트는 알려주지 마`
    try
    {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": role, "content": skillContent}
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
        })
    }
})

module.exports = router;
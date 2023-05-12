const router = require("express").Router();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.ORG_KEY,
  apiKey: process.env.GPT_API_KEY,
});
const openai = new OpenAIApi(configuration);
const role = "user";
const ideaContent =
  "초보 개발자 5명이 14일동안 개발할 수 있는 재미있고 유용한 사이드 프로젝트 하나만 추천해줘";

const GetSpeechSummaryText = (messages) => {
  const head =
    "너에게 회의 중 나온 말들을 전달할거야. 한 마디 말은 | 기호를 사용해서 구분했어. \n";
  const want =
    "회의 중 나온 말들을 전부 종합한 후, 회의의 총 주제(subject), 전체 회의 주제 요약 내용(summary)을 OBJECT 형식으로만 만들어서 나에게 알려줘 \n";
  const subwant = "OBJECT 형식은 다음과 같아. {subject: '', summary: ''} \n";

  let body = "";
  for (let index = 0; index < messages.length; ++index) {
    body += messages[index];
    body += "|";
  }
  body += "\n";

  return head + want + subwant + body;
};

const GetSummaryText = (messagesPerUser) => {
  const head =
    "너에게 회의 참석자와 그 참석자가 말한 내용에 대해 알려줄거야. \n";
  const want =
    "회의 참석자가 나눈 대화를 바탕으로 회의에 대한 총 주제(title) 로 말한 내용을 약 20단어로 요약하고, 전체 회의 주제 요약 내용 및 어떤 내용을 누가 말했는지 요약해서 (description)을 나에게 알려줘 description은 모두 String이여야해 \n";
  let subwant =
    "JSON 형식만 반환해줘. 예를 들어, { title: '', description: '',} 이런 형식으로,\n";
  let body = "";
  let contents = [];

  for (const user in messagesPerUser) {
    let content = `"${user}"는(은) 다음과 같이 말했어: `;

    for (let index = 0; index < messagesPerUser[user].length; ++index) {
      let message = messagesPerUser[user][index];
      content += `${message}, `;
    }
    content += "\n";
    contents.push(content);
  }

  for (let index = 0; index < contents.length; ++index) {
    body += contents[index];
  }

  return head + want + subwant + body;
};

router.post("/time-line", async (req, res) => {
  const messages = req.body.messages;

  let messagesPerUser = {};
  try {
    for (let index = 0; index < messages.length; ++index) {
      const user = messages[index].split(": ")[0];
      const message = messages[index].split(": ")[1];

      if (messagesPerUser[user] === undefined) {
        messagesPerUser[user] = [message];
      } else {
        messagesPerUser[user].push(message);
      }
    }

    const content = GetSummaryText(messagesPerUser);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: role, content: content }],
    });
    console.log(response.data);
    return res.status(200).send({
      data: response.data,
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/transcript", async (req, res) => {
  const messages = req.body.messages;
  try {
    const content = GetSpeechSummaryText(messages);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: role, content: content }],
    });
    return res.status(200).send({
      data: response.data,
    });
  } catch (error) {}
});

router.post("/project/idea", async (req, res) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: role, content: ideaContent }],
    });
    return res.status(200).send({
      data: response.data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Server Error",
    });
  }
});

router.post("/skill/problem", async (req, res) => {
  const { skillName } = req.body;
  const skillContent = `${skillName}을 이용해 초보자가 풀 수 있는 문제 1개 문제를 150개 단어 내로 알려줘. 다만, 문제에 대한 상세 설명, 구현 방법, 푸는 방법, 힌트는 알려주지 마`;
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: role, content: skillContent }],
    });
    console.log(response);

    return res.status(200).send({
      data: response.data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Server Error",
    });
  }
});

module.exports = router;

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { StreamChat } = require('stream-chat');
const AWS = require('aws-sdk');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const serverSideClient = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_APP_SECRET
);

const translate = new AWS.Translate({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
});

app.post('/translate', (req, res) => {
  const { text, lang } = req.body;
  const params = {
    SourceLanguageCode: 'auto',
    TargetLanguageCode: lang,
    Text: text,
  };

  translate.translateText(params, (err, data) => {
    if (err) {
      return res.send(err);
    }

    res.json(data);
  });
});

app.post('/join', async (req, res) => {
  const { username } = req.body;
  let token;

  try {
    token = serverSideClient.createToken(username);
    await serverSideClient.updateUser(
      {
        id: username,
        name: username,
      },
      token
    );

    const admin = { id: 'admin' };
    const channel = serverSideClient.channel('messaging', 'discuss', {
      name: 'Discussion',
      created_by: admin,
    });

    await channel.create();
    await channel.addMembers([username, 'admin']);
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }

  return res
    .status(200)
    .json({ user: { username }, token, api_key: process.env.STREAM_API_KEY });
});

const server = app.listen(process.env.PORT || 5500, () => {
  const { port } = server.address();
  console.log(`Server running on PORT ${port}`);
});

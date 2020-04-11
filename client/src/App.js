import React from 'react';
import {
  Chat,
  Channel,
  Thread,
  Window,
  ChannelList,
  ChannelListMessenger,
  ChannelPreviewMessenger,
  MessageList,
  MessageSimple,
  MessageInput,
  withChannelContext,
} from 'stream-chat-react';
import rug from 'random-username-generator';
import { StreamChat } from 'stream-chat';
import axios from 'axios';

import 'stream-chat-react/dist/css/index.css';

let chatClient;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      channel: null,
      language: 'en',
      messages: [],
    };
  }

  async componentDidMount() {
    const username = rug.generate();
    try {
      const response = await axios.post('http://localhost:5500/join', {
        username,
      });
      const { token } = response.data;
      const apiKey = response.data.api_key;

      chatClient = new StreamChat(apiKey);

      const user = await chatClient.setUser(
        {
          id: username,
          name: username,
        },
        token
      );

      const channel = chatClient.channel('messaging', 'discuss');
      await channel.watch();

      this.setState(
        {
          channel,
        },
        () => {
          channel.on('message.new', async event => {
            if (user.me.id !== event.user.id) {
              try {
                const response = await axios.post(
                  'http://localhost:5500/translate',
                  {
                    text: event.message.text,
                    lang: this.state.language,
                  }
                );

                const msg = event.message;
                msg.text = response.data.TranslatedText;
                this.setState({
                  messages: [...this.state.messages, msg],
                });
              } catch (err) {
                console.log(err);
              }
            } else {
              this.setState({
                messages: [...this.state.messages, event.message],
              });
            }
          });
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  setLanguage = lang => {
    this.setState({
      language: lang,
    });
  };

  render() {
    const { channel, language, messages } = this.state;
    const { setLanguage } = this;

    if (channel) {
      const CustomChannelHeader = withChannelContext(
        class CustomChannelHeader extends React.PureComponent {
          render() {
            return (
              <div className="str-chat__header-livestream">
                <div className="str-chat__header-livestream-left">
                  <p className="str-chat__header-livestream-left--title">
                    {this.props.channel.data.name}
                  </p>
                  <p className="str-chat__header-livestream-left--members">
                    {Object.keys(this.props.members).length} members,{' '}
                    {this.props.watcher_count} online
                  </p>
                </div>
                <div className="str-chat__header-livestream-right">
                  <div className="str-chat__header-livestream-right-button-wrapper">
                    <select
                      id="language"
                      className="language"
                      name="language"
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          }
        }
      );

      return (
        <Chat client={chatClient} theme="messaging dark">
          <ChannelList
            options={{
              subscribe: true,
              state: true,
            }}
            List={ChannelListMessenger}
            Preview={ChannelPreviewMessenger}
          />
          <Channel channel={channel}>
            <Window>
              <CustomChannelHeader />
              <MessageList Message={MessageSimple} messages={messages} />
              <MessageInput focus />
            </Window>
            <Thread Message={MessageSimple} />
          </Channel>
        </Chat>
      );
    }

    return <div>Loading...</div>;
  }
}

export default App;

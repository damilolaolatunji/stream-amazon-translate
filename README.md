# Build a Multilingual Chat App with Amazon Translate and Stream

Tutorial:

# Pre-requisites
- Make sure you have Node.js (version 10 or later) and [yarn](https://yarnpkg.com/lang/en/docs/install/) installed on your machine.

## Build instructions
- Clone this repository and `cd` into it.
- Run `yarn` to install the dependencies for the server.
- `cd` into the `client` folder and run `yarn` to install the dependencies for the
    client
- See tutorial for notes on how to get the required credentials from Stream and
    Amazon AWS.
- Rename the `.env.example` file to `.env` and update it with your Stream and AWS credentials.
- Run `node server.js` from within the project root to start the Node server on port 5500.
- Run `yarn start` from the `client` folder to start the React app development server.
- View http://localhost:3000 in your browser.

## Built With
- [React](https://reactjs.org) - For creating the application frontend
- [Amazon Translate](https://aws.amazon.com/translate/) - Language translation
    features
- [Stream Chat](https://getstream.io/chat/) - Chat features

## Licence
- [MIT](https://opensource.org/licenses/MIT)

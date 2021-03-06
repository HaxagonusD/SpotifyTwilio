require("dotenv").config();
const Twilio = require("twilio");
const accountSid = process.env.ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
const twilioNumber = process.env.TWILIO_NUMBER; // Twilio number
const client = new Twilio(accountSid, authToken);

const FindOneUserByID = require("../database/Queries/FindOneUserByID");

//router layer  >>>  req, res
//service layer (business logic) >>> internal stuff 
//data access >>> should only thing accessing database

module.exports = (user) => {
  console.log(user);
  for (const subscriber of user.subscribers) {
    // console.log("Twilio is sending message... ");
    FindOneUserByID(subscriber)
      .then((document) => {
        if (document) {
          client.messages
            .create({
              body: `${user.displayName} is currently listening to ${user.currentTrack.songName} by ${user.currentTrack.artistName}. SpotifyTwilio: https://spotifytwilio.herokuapp.com/profile/${user.id} Song: https://open.spotify.com/track/${user.currentTrack.songId}`,
              to: document.phoneNumber,
              from: twilioNumber,
            })
            .then((message) => {
              // console.log("message: ", message);
            })
            .catch((e) => {
              console.error(e);
            });
        } else {
          //since the subscriber wasn't found  in the databse remove the user from the subscribers list so it dones;t happena gain
          const whereIsUnknownSubscriber = user.subscribers.indexOf(subscriber);
          user.subscribers.splice(whereIsUnknownSubscriber, 1);
          user.save().catch((error) => console.error(error));
        }
      })
      .catch((error) => console.error(error));
  }
};

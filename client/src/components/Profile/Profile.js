import React from "react";
import axios from "axios";
import { Redirect, useParams, useHistory } from "react-router-dom";

// import "../styles/Config/Config.css";
const Profile = ({ user, loggedIn }) => {
  const { id } = useParams();
  let history = useHistory();

  const subcribeToThisUser = () => {
    //send a request with the id of the user in the url

    const instance = axios.create({
      withCredentials: true,
    });
    instance
      .post(`/api/subscribe/${id}`)
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
  };
  const logOut = () => {
    const instance = axios.create({
      withCredentials: true,
    });
    instance
      .get(`/auth/logout`)
      .then(() => {
        history.push("/");
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <button onClick={() => subcribeToThisUser()}>Subscribe</button>
      <div className="logoutButton">
        <button onClick={() => logOut()}>Logout</button>
      </div>

      {user !== undefined ? (
        <div>
          <h1>Name : {user.displayName}</h1>
          <h1>id: {user.id}</h1>
          {/* <p>Number of subscribers: {user.subscribers.length}</p> */}
          <a
            href={"https://open.spotify.com/track/" + user.currentTrack.songId}
          >
            CurrentTrack
          </a>
        </div>
      ) : (
        "Loading..."
      )}
      {/* <h1>Name : {user.displayName}</h1> */}
      {/* <h1>id: {user.id}</h1> */}
      {/* <p>{user.subcribers.length === 0 ? "No subscriber": user.subcribers.length}</p> */}
    </div>
  );
};

export default Profile;
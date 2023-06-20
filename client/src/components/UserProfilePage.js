import axios from "axios";
import { useState, useEffect } from "react";

export default function CreateProfilePage(props) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userqs, setUserqs] = useState([]);
  if(userqs!==[]){

  }
  const logout = () => {
    axios
      .post("http://localhost:8000/logout", {}, { withCredentials: true })
      .then((response) => {
        // Handle the response from the server
        if (response.status === 200) {
          setUser(null);
          setUserData(null);
          props.refreshData();
          props.onUp(7);
        } else {
          console.error("Logout failed:", response);
        }
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  useEffect(() => {
    function getCurrentUserId() {
      axios
        .get("http://localhost:8000/current-user", {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data._id) {
            console.log("Logged in user ID is: ", response.data._id);
            setUser(response.data._id);
          } else {
            console.log("Not logged in");
            setUser(null);
          }
        })
        .catch((error) => {
          console.error("Error getting current user ID:", error);
        });
    }

    getCurrentUserId();
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/users/${user}`)
        .then((response) => response.json())
        .then((data) => setUserData(data))
        .catch((err) => console.error(err));

      const userQuestions = props.questions.filter(
        (question) => question.asked_by.username === user
      );
      setUserqs(userQuestions);
    }
  }, [user, props.questions]);

  if (!user || !userData) {
    return <div>Loading...</div>;
  }
  function toEdit(q) {
    props.edQ(q);
  }

  return (
    <div>
      <h1>Profile Page:</h1>
      <b>logout</b>
      <button onClick={logout}>Logout</button>
      <p>Account created on: {userData.createdAt}</p>
      <p>Reputation: {userData.reputation}</p>
      <p>Your Posts</p>
      {userData.questions.map((q, index) => (
        <div key={index}>
          <a
            onClick={() => {
              props.handleQuestionClick(q._id);
              console.log(q);
              props.onUp(q);
              props.refreshData();
            }}
          >
            {q.title}
          </a>
          <button onClick={() => toEdit(q)}>Edit</button>
        </div>
      ))}
      <p>Your answers</p>
      {userData.answers.map((a, index) => (
        <div key={index}>
          <a
            onClick={() => {
              props.handleQuestionClick(a.question._id);
              props.onUp(a.question);
              props.refreshData();
            }}
          >
            {a.text}
          </a>
        </div>
      ))}
    </div>
  );
}

import React from "react";

import CreateLeftMenu from "./LeftMenu";
import CreateCommentViewer from "./DisplayComments";
import { useState } from "react";
function QuestionViewer({
  viewQuestion,
  answers,
  newComment,
  comments,
  tags,
  questions,
  onUpdate,
  onUpdateVote,
  refreshData,
  comVote,
  guest,
}) {
  const [newC, setNewC] = useState("");
  const [newO, setNewO] = useState(["", ""]);

  let liked = false;
  if (!viewQuestion) {
    return <div>Loading...</div>;
  }

  const numOfAnswers = viewQuestion.answers.length;
  const question_header = viewQuestion.title;
  const amt_of_views = viewQuestion.views;
  const question_asker = viewQuestion.asked_by.username;
  const question_text = viewQuestion.text;
  const question_answers = answers.filter((answer) =>
    viewQuestion.answers.includes(answer._id)
  );

  const newComm = async (event) => {
    if (guest === false) {
      event.preventDefault();
      //console.log(`Username: ${username}, Password: ${password}`);
      await newComment(newC, "hi", viewQuestion._id);
      //props.onUp(2);
    } else {
      alert("Guests can't create comments");
    }
  };

  const newCommA = async (event) => {
    if (guest === false) {
      event.preventDefault();
      //console.log(`Username: ${username}, Password: ${password}`);
      await newComment(newO[0], "hi", newO[1], true);
      //props.onUp(2);
    } else {
      alert("Guests can't create comments");
    }
  };

  // const question_answerers = question_answers.map((answer) => answer.ans_by);

  // for (let i = 0; i < viewQuestion.answers.length; i++) {
  //   answers.filter((answer) => {
  //     if (answer.id == viewQuestion.answers[i].id) {
  //       question_answers.push(answer);
  //       question_answerers.push(answer.ans_by);
  //     }
  //   });
  //   console.log(question_answers[0] + "\n");
  // }
  function handleQuestion() {
    onUpdate(1);
  }
  function handleAnswer() {
    if (guest === false) {
      onUpdate(3);
    } else {
      alert("guests can't create answers");
    }
  }
  
  const parseTextWithLinks = (text) => {
    const parts = text.split(/(\[.+?\]\(.+?\))/);
    const parsed = parts.map((part, index) => {
      const match = part.match(/\[(.+?)\]\((.+?)\)/);
      if (match) {
        const text = match[1];
        const url = match[2];

        if (url.startsWith("https://") || url.startsWith("http://")) {
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              {text}
            </a>
          );
        } else {
          return (
            <span key={index} className="error">
              Invalid URL: {url}
            </span>
          );
        }
      } else {
        return part;
      }
    });
    return parsed;
  };
  const handleUpVote = async (answerId, answer) => {
    if (guest === false) {
      if (liked === false) {
        await onUpdateVote(answerId, "up", answer, viewQuestion);
        liked = true;
        refreshData();
      }
    } else {
      alert("guests can't upvote");
    }
  };

  const handleDownVote = async (answerId, answer) => {
    if (guest === false) {
      if (liked === false) {
        await onUpdateVote(answerId, "down", answer, viewQuestion);
        liked = true;
        refreshData();
      }
    } else {
      alert("guests can't downvote");
    }
  };
  const displayTime = (askDate) => {
    const now = new Date();
    const postedDate = new Date(askDate);
    const diffInSeconds = Math.floor((now - postedDate) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays >= 365) {
      return `${postedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} at ${postedDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    if (diffInDays >= 1) {
      return `${postedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} at ${postedDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    if (diffInHours >= 1) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    }

    if (diffInMinutes >= 1) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }

    return `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;
  };

  return (
    <div>
      <div id="cont" className="container">
        <CreateLeftMenu updateFunc={onUpdate} />
        <div>
          <p className="ans_co">{numOfAnswers} answers</p>
          <p className="title_1">{question_header}</p>
          <b>
            <button className="btn" onClick={() => handleQuestion()}>
              Ask Question
            </button>
          </b>
          <p className="total_v">{amt_of_views + 1} views</p>
          <p className="para">{parseTextWithLinks(question_text)}</p>
          <CreateCommentViewer
            viewQuestion={viewQuestion}
            comments={comments}
            isQ={true}
            onUpdateVote={comVote}
            refreshData={refreshData}
            guest={guest}
          />
          <form onSubmit={newComm}>
            <input
              type="text"
              id="comm"
              value={newC}
              onChange={(e) => setNewC(e.target.value)}
              required
            ></input>
          </form>
          <div className="lineDiv">
            <div className="stacked">
              <p className="askedBy">{question_asker}</p>
              <p className="a_date">
                asked {displayTime(viewQuestion.ask_date_time)}
              </p>
            </div>
            {question_answers.map((answer) => (
              <div key={answer.aid} className="ans_holder">
                <th className="ans_para">{parseTextWithLinks(answer.body)}</th>
                <th className="ans_tn">
                  <p>{answer.createdBy}</p>
                  <p>answered {displayTime(answer.createdAt)}</p>
                </th>
                <th>upvotes: {answer.votes}</th>
                <th>
                  <button onClick={() => handleUpVote(answer._id, answer)}>
                    Upvote
                  </button>
                  <button onClick={() => handleDownVote(answer._id, answer)}>
                    Downvote
                  </button>
                </th>
                <CreateCommentViewer
                  isQ={false}
                  viewAnswer={answer}
                  comments={comments}
                  onUpdateVote={comVote}
                  refreshData={refreshData}
                  guest={guest}
                />
                <form onSubmit={newCommA}>
                  <input
                    type="text"
                    id="comms"
                    value={newO[0]}
                    onChange={(e) => setNewO([e.target.value, answer._id])}
                    required
                  ></input>
                </form>
              </div>
            ))}
          </div>
          <button className="b" onClick={() => handleAnswer()}>
            Answer Question
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionViewer;

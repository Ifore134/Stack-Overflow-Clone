import React, { useState, useEffect } from "react";

export default function createQuestionViewer(props) {
  // const handleQuestionClick = async (question) => {
  //   const BASE_URL = "http://localhost:8000";
  //   try {
  //     const response = await fetch(
  //       `${BASE_URL}/questions/${question._id}/view`,
  //       {
  //         method: "PUT",
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to update views");
  //     }
  //     const updatedQuestion = await response.json();
  //     props.spQ(updatedQuestion);
  //   } catch (error) {
  //     console.error("Error updating views:", error);
  //   }
  // };

  const { questions, tags, sortOrder, handleQuestionClick } = props;
  let qqq = questions.slice(props.curQs - 5, props.curQs);
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

  const sortQuestions = (questions) => {
    if (sortOrder === "newest") {
      return questions.sort(
        (a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time)
      );
    } else if (sortOrder === "unanswered") {
      return questions.sort((a, b) => a.answers.length - b.answers.length);
    } else if (sortOrder === "active") {
      return questions.sort((a, b) => {
        const latestAnswerA = a.answers.sort(
          (x, y) => new Date(y.ans_date_time) - new Date(x.ans_date_time)
        )[0];
        const latestAnswerB = b.answers.sort(
          (x, y) => new Date(y.ans_date_time) - new Date(x.ans_date_time)
        )[0];

        if (!latestAnswerA) return 1;
        if (!latestAnswerB) return -1;
        return (
          new Date(latestAnswerB.ansDate) - new Date(latestAnswerA.ansDate)
        );
      });
    } else {
      return questions;
    }
  };
  return (
    <table id="table">
      {sortQuestions(questions).map((question) => (
        <tr key={question.id}>
          <th key={`${question.id}-1`} className="first_thing">
            <div id="answer_views">
              <div id="answers">{question.answers.length} Answers</div>
              <div id="views">{question.views} Views</div>
              {/* <div id="votes">{question.</div> */}
            </div>
          </th>
          <th key={`${question.id}-2`} className="title_col">
            <a
              className="hp-questions"
              onClick={async () => {
                await handleQuestionClick(question._id);
                props.spQ(question);
              }}
            >
              {question.title}
            </a>
            <p>{question.summary}</p>
            <br />
            {question.tags.map((tagId) => {
              const tag = tags.find((tag) => tag._id == tagId);
              if (tag) {
                return (
                  <p key={tagId} className="divTags">
                    {tag.name}
                  </p>
                );
              }
            })}
          </th>
          <th key={`${question.id}-3`}>
            <div id="author">{question.asked_by.username}</div>
            <div className="dates">
              asked {displayTime(question.ask_date_time)}
            </div>
          </th>
        </tr>
      ))}
    </table>
  );
}

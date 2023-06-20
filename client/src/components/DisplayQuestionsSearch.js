import React from "react";

export default function CreateQuestionSearch(props) {
  const { questions, tags, sortOrder, handleQuestionClick } = props;

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
  const searchQ = (query) => {
    let result = query
      .toLowerCase()
      .split(" ")
      .filter((element) => element.trim() !== "");
    let filteredQs = [];

    questions.forEach((q) => {
      var title = q.title.toLowerCase();
      var qTags = q.tags.map((tid) => {
        const tag = tags.find((tag) => tag._id === tid);
        return tag ? tag.name : "";
      });

      let matchFound = result.some((element) => {
        if (element[0] === "[" && element.at(-1) === "]") {
          return qTags.includes(element.slice(1, -1));
        } else {
          return title.includes(element);
        }
      });

      if (matchFound) {
        filteredQs.push(q);
      }
    });

    props.lengthUp(filteredQs.length);
    return filteredQs;
  };

  return (
    <table id="table">
      {sortQuestions(searchQ(props.currSearch)).map((question) => (
        <tr key={question._id}>
          <th key={`${question._id}-1`} className="first_thing">
            <div id="answer_views">
              <div id="answers">{question.answers.length} Answers</div>
              <div id="views">{question.views} Views</div>
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
          <th key={`${question._id}-3`}>
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

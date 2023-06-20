import "../stylesheets/App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import CreateQuestionPage from "./QuestionPage";
import CreateHomePage from "./HomePage";
import CreateAnswerPage from "./AnswerPage";
import CreateTagsPage from "./TagsPage";
import Header from "./Header";
import QuestionViewer from "./SpecificQuestion";
import CreateSearchPage from "./SearchPage";
import CreateWelcomePage from "./WelcomePage";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegisterPage";
import AdminProfile from "./AdminProfile";
import CreateProfilePage from "./UserProfilePage";
import EditQuestionPage from "./EditQuestionPage";
function App() {
  const [currentPage, setCurrentPage] = useState(7);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentQ, setCurrentQ] = useState();
  const [searchText, setSearchText] = useState("");
  const [length, setLength] = useState(0);
  const [comments, setComments] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [qtoshow, setQToShow] = useState(5);
  //const [curUser, setCurUser] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  // const [thecurqs, setTheCurQs] = useState(
  //   questions.slice(qtoshow - 5, qtoshow)
  // );
  let page;
  async function refreshData() {
    const fetchedQuestions = await fetchQuestions();

    const fetchedAnswers = await fetchAnswers();
    const fetchedTags = await fetchTags();
    const fetchedComments = await fetchComments();
    setQuestions(fetchedQuestions);
    setAnswers(fetchedAnswers);
    setTags(fetchedTags);
    setComments(fetchedComments);
  }
  useEffect(() => {
    getLoggedInUser().then((userId) => {
      if (userId) {
        setCurrentPage(2);
        refreshData();
      }
    });
  }, []);

  const handleQuestionClick = async (questionId) => {
    const BASE_URL = "http://localhost:8000";
    try {
      const response = await fetch(`${BASE_URL}/questions/${questionId}/view`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to update views");
      }
      const updatedQuestion = await response.json();
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q._id === questionId ? updatedQuestion : q))
      );
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };
  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/questions", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchAnswers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/answers", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  };
  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:8000/tags", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };
  const fetchComments = async () => {
    try {
      const response = await axios.get("http://localhost:8000/comments", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const getLoggedInUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/session", {
        withCredentials: true,
      });
      return response.data.session ? response.data.session.userId : null;
    } catch (error) {
      console.error("Error getting logged in user: ", error);
      return null;
    }
  };

  // useEffect(() => {
  //   fetchQuestions().then((data) => {
  //     console.log("Questions fetched:", data);
  //     setQuestions(data);
  //   });
  // }, []);
  // useEffect(() => {
  //   fetchAnswers().then((data) => {
  //     console.log("Answers fetched:", data);
  //     setAnswers(data);
  //   });
  // }, []);
  // useEffect(() => {
  //   fetchTags().then((data) => {
  //     console.log("Tags fetched:", data);
  //     setTags(data);
  //   });
  // }, []);

  function updatePage(newPage) {
    setCurrentPage(newPage);
  }
  function spq(q) {
    setCurrentPage(5);
    setCurrentQ(q);
  }
  function setSearch(q) {
    setSearchText(q);
  }

  function addQuestion(newDesc, newTitle, newSummary) {
    const postQuestions = async () => {
      try {
        const response = await axios.post("http://localhost:8000/questions", {
          title: newTitle,
          text: newDesc,
          summary: newSummary,
          tags: [],
          answers: [],
          ask_date_time: new Date(),
          views: 0,
        });
        return response.data._id;
      } catch (error) {
        console.error("Error posting question:", error);
      }
    };
    return postQuestions();
  }
  function addComment(body, createdBy, question, qorA = false) {
    if(createdBy==="hi"){

    }
    if (qorA === false) {
      const postComment = async () => {
        try {
          const response = await axios.post("http://localhost:8000/comments", {
            body: body,
            question: question,
            views: 0,
          });
          const updatedQuestion = await axios.put(
            `http://localhost:8000/questions/${question}`,
            {
              $push: { comments: response.data._id },
            }
          );
          console.log(updatedQuestion);
          //question.comments.push(response)
          //const response2= await axios.put(`http://localhost:8000/questions/${question}`,{response:response});
          return response.data._id;
        } catch (error) {
          console.error("Error posting comment:", error);
        }
      };
      refreshData();
      return postComment();
    } else {
      const postComment = async () => {
        try {
          const response = await axios.post("http://localhost:8000/comments", {
            body: body,

            answer: question,
            views: 0,
          });
          const updatedAnswer = await axios.put(
            `http://localhost:8000/answers/${question}`,
            {
              $push: { comments: response.data._id },
            }
          );
          console.log(updatedAnswer);
          return response.data._id;
        } catch (error) {
          console.error("Error posting comment:", error);
        }
      };
      refreshData();
      return postComment();
    }

    //return postComment();
  }
  function addLogin(user, password) {
    const postLog = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/login",
          {
            username: user,
            password: password,
          },
          { withCredentials: true }
        );
        console.log(response);
        if (response.data.success) {
          console.log("asdasdasdadadssa");
          setIsLoggedIn(true);
        } else {
          console.log(response);
          console.error("Login failed:", response.data.message);
        }
        // return the response so that you can use .then or .catch on addLogin
        return response;
      } catch (error) {
        console.error("Error logging in:", error);
        // throw the error so that you can catch it in .catch
        throw error;
      }
    };
    // call and return the result of postLog
    return postLog();
  }
  const handleUpdateVote = async (answerId, voteType, answer, viewQ) => {
    try {
      if (voteType === "up") {
        answer.votes += 1;
      } else if (answer.votes !== 0) {
        answer.votes -= 1;
      }

      console.log(answerId, "answererererrererrerererere");
      const response = await axios.put(
        `http://localhost:8000/answers/${answerId}`,
        answer
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const commentUpdateVote = async (commentId, voteType, comment) => {
    try {
      if (voteType === "up") {
        comment.votes += 1;
      } else if (comment.votes !== 0) {
        comment.votes -= 1;
      }

      console.log(comment.votes, "answererererrererrerererere");
      const response = await axios.put(
        `http://localhost:8000/comments/${commentId}`,
        comment
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  function editQuestion(qID, title, desc, tags, summary) {
    const eQ = async () => {
      try {
        let b = currentQ;
        b.title = title;
        b.text = desc;
        b.summary = summary;
        b.tags = tags;

        const response = await axios.put(
          `http://localhost:8000/questions/${qID}`,
          b
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    eQ();
  }

  function addAnswers(newText, newUser, qID) {
    const postAnswers = async () => {
      console.log(newText, "yoyooyooyoyoyoyoy");
      try {
        const response = await axios.post("http://localhost:8000/answers", {
          body: newText,
          createdBy: newUser,
          question: qID,
        });
        console.log(response);
        // Check if the response data contains the answer object
        if (response.data._id) {
          addToAnsArr(qID, response.data._id);
        }
      } catch (error) {
        console.error("Error posting answer:", error);
      }
    };
    postAnswers();
  }

  function addToAnsArr(questionId, aid) {
    const linkAnswerToQuestion = async (questionId, aid) => {
      console.log(aid, "IDIDIDIDIDIDIDID");
      console.log(questionId, "ODODODODODODODOD");
      try {
        const response = await axios.put(
          `http://localhost:8000/questions/${questionId}/answers/${aid}`,
          {
            method: "PUT",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to link answer to the question");
        }
        const updatedQuestion = await response.json();
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) => (q._id === questionId ? updatedQuestion : q))
        );
        refreshData();
      } catch (error) {
        console.error("Error linking answer to the question:", error);
      }
    };
    linkAnswerToQuestion(questionId, aid);
  }
  function addTag(name, qid, userid) {
    const postTags = async () => {
      try {
        const response = await axios.post("http://localhost:8000/tags", {
          name: name,
          created: userid,
        });
        if (response.data) {
          addToTagArr(response.data._id, qid);
        }
      } catch (error) {
        console.error("Error posting answer:", error);
      }
    };
    postTags();
  }

  async function addToTagArr(tag, questionId) {
    try {
      console.log(questionId);
      const response = await axios.put(
        `http://localhost:8000/questions/${questionId}/tags`,
        {
          tagId: tag,
        }
      );
      refreshData();
      console.log(response.data);
    } catch (error) {
      console.error("Error adding tag to the question:", error);
    }
  }
  function changeQ(q) {
    setCurrentQ(q);
    setCurrentPage(12);
  }

  if (currentPage === 1) {
    page = (
      <CreateQuestionPage
        onUpdate={updatePage}
        questions={questions}
        tags={tags}
        addTag={addTag}
        addToTagArr={addToTagArr}
        addQuestion={addQuestion}
        refreshData={refreshData}
      />
    );
  } else if (currentPage === 2) {
    page = (
      <CreateHomePage
        questions={questions.slice(qtoshow - 5, qtoshow)}
        setNext={setQToShow}
        nowQ={qtoshow}
        tags={tags}
        onUp={spq}
        isLoggedIn={isLoggedIn}
        onUpdate={updatePage}
        refreshData={refreshData}
        handleQuestionClick={handleQuestionClick}
        guest={isGuest}
      />
    );
  } else if (currentPage === 3) {
    page = (
      <CreateAnswerPage
        onUpdate={updatePage}
        questions={questions}
        answers={answers}
        viewQuestion={currentQ}
        addAnswers={addAnswers}
        refreshData={refreshData}
      />
    );
  } else if (currentPage === 4) {
    page = (
      <CreateTagsPage
        onUpdate={updatePage}
        questions={questions}
        tags={tags}
        search={setSearchText}
      />
    );
  } else if (currentPage === 5) {
    page = (
      <QuestionViewer
        viewQuestion={currentQ}
        answers={answers}
        comments={comments}
        newComment={addComment}
        tags={tags}
        questions={questions}
        onUpdate={updatePage}
        curQs={qtoshow}
        changeCurQs={setQToShow}
        onUpdateVote={handleUpdateVote}
        refreshData={refreshData}
        comVote={commentUpdateVote}
        guest={isGuest}
      />
    );
  } else if (currentPage === 6) {
    page = (
      <CreateSearchPage
        questions={questions}
        answers={answers}
        tags={tags}
        onUpdate={spq}
        handleQuestionClick={handleQuestionClick}
        currSearch={searchText}
        lengthUp={setLength}
        lengthSize={length}
        onUp={updatePage}
      />
    );
  } else if (currentPage === 7) {
    page = (
      <CreateWelcomePage
        onUp={updatePage}
        refreshData={refreshData}
        setGuest={setIsGuest}
      />
    );
  } else if (currentPage === 8) {
    page = (
      <LoginPage
        loginfunc={addLogin}
        onUp={updatePage}
        isLoggedIn={isLoggedIn}
        refreshData={refreshData}
      />
    );
  } else if (currentPage === 9) {
    page = <RegistrationPage onUp={updatePage} refreshData={refreshData} />;
  } else if (currentPage === 10) {
    page = (
      <AdminProfile
        handleQuestionClick={handleQuestionClick}
        refreshData={refreshData}
        onUp={updatePage}
      />
    );
  } else if (currentPage === 11) {
    page = (
      <CreateProfilePage
        questions={questions}
        refreshData={refreshData}
        handleQuestionClick={handleQuestionClick}
        onUp={setCurrentPage}
        lengthUp={setLength}
        edQ={changeQ}
      />
    );
  } else if (currentPage === 12) {
    page = (
      <EditQuestionPage
        currentQ={currentQ}
        onUpdate={updatePage}
        questions={questions}
        tags={tags}
        addTag={addTag}
        editQuestion={editQuestion}
        addToTagArr={addToTagArr}
        addQuestion={addQuestion}
        refreshData={refreshData}
      />
    );
  }

  return (
    <section className="fakeso">
      <Header onUpdate={updatePage} changeSearch={setSearch} />
      {page}
    </section>
  );
}

export default App;

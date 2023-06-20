import React, { useState } from "react";
import CreateLeftMenu from "./LeftMenu.js";
import DisplayQuestions from "./DisplayQuestions.js";

export default function CreateHomePage(props) {
  const { isLoggedIn, questions, tags, handleQuestionClick,guest } = props;

  const [sortOrder, setSortOrder] = useState("newest");

  const handleSortOrder = (order) => {
    setSortOrder(order);
  };

  function handleClick() {
    if(guest===false){
      props.onUpdate(1);
    }
    else{
      alert("guests can't ask questions")
    }
    
  }
  function handleNext(){
    props.setNext(props.nowQ+5)
  }
  function handlePrev(){
    if (props.nowQ>5){
      props.setNext(props.nowQ-5)
    }
  }

  return (
    <div id="container" className="container">
      <CreateLeftMenu updateFunc={props.onUpdate} activeSection="questions" />
      <div id="header">
        <div className="hp-buttons">
          <button className="newest" onClick={() => handleSortOrder("newest")}>
            Newest
          </button>
          <button className="active" onClick={() => handleSortOrder("active")}>
            Active
          </button>
          <button
            className="unans"
            onClick={() => handleSortOrder("unanswered")}
          >
            Unanswered
          </button>
        </div>
        <h2>All Questions</h2>
        <p id="q-count">{questions.length} Questions</p>
        <button id="prev" onClick={()=>handlePrev()}>Prev</button>
        <button id="next" onClick={()=>handleNext()}>Next</button>
        
        <DisplayQuestions
          questions={questions}
          tags={tags}
          sortOrder={sortOrder}
          spQ={props.onUp}
          refreshData={props.refreshData}
          handleQuestionClick={handleQuestionClick}
        />
      </div>
      <div id="div2">
        <div id="header"></div>
        <button className="btn" id="hpq-button" onClick={() => handleClick()}>
          Ask Questions
        </button>
      </div>
    </div>
  );
}

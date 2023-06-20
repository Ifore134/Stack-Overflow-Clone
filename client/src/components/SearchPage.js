import React, { useState } from "react";
import CreateLeftMenu from "./LeftMenu.js";
import CreateQuestionSearch from "./DisplayQuestionsSearch.js";

export default function CreateSearchPage(props) {
  const [sortOrder, setSortOrder] = useState("newest");

  const handleSortOrder = (order) => {
    setSortOrder(order);
  };

  function handleClick() {
    props.onUp(1);
  }
  return (
    <div id="container" className="container">
      <CreateLeftMenu updateFunc={props.onUp} />
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
        <h2>Search Questions</h2>
        <p id="q-count">{props.lengthSize} Questions</p>
        <CreateQuestionSearch
          currSearch={props.currSearch}
          newmodel={props.newmodel}
          questions={props.questions}
          answers={props.answers}
          tags={props.tags}
          sortOrder={sortOrder}
          spQ={props.onUpdate}
          lengthUp={props.lengthUp}
          lengthSize={props.lengthSize}
          handleQuestionClick={props.handleQuestionClick} 
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

import CreateLeftMenu from "./LeftMenu.js";
import axios from "axios";

export default function EditQuestionPage(props) {
  const validateHyperlinks = (text) => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const url = match[2];
      if (!url || !(url.startsWith("https://") || url.startsWith("http://"))) {
        return false;
      }
    }
    return true;
  };
  async function handleClick() {
    let newTitle = document.getElementById("question-title").value;
    if (newTitle.length === 0) {
      window.alert("Title is required");
      return;
    }
    if (newTitle.length >= 100) {
      window.alert("Title must be less than 100 characters");
      return;
    }
    let newDesc = document.getElementById("question-text").value;
    if (newDesc.length === 0) {
      window.alert("Text is required");
      return;
    }
    if (!validateHyperlinks(newDesc)) {
      window.alert(
        "Invalid hyperlink format. Hyperlinks must be in the format [text](link) and start with 'https://' or 'http://'."
      );
      return;
    }
    let newSummary = document.getElementById("question-summary").value;
    if (newDesc.length === 0) {
      window.alert("Text is required");
      return;
    }
    if (newSummary.length >= 100) {
      window.alert("Summar must be less than 140 characters");
      return;
    }
    if (!validateHyperlinks(newDesc)) {
      window.alert(
        "Invalid hyperlink format. Hyperlinks must be in the format [text](link) and start with 'https://' or 'http://'."
      );
      return;
    }
    let currentUserId;
    try {
      const response = await axios.get("http://localhost:8000/session", {
        withCredentials: true,
      });
      if (response.status === 200) {
        currentUserId = response.data.session.userId;
      } else {
        throw new Error("Failed to fetch current user ID");
      }
    } catch (error) {
      console.error("Error fetching current user ID:", error);
      return;
    }
    let q_id = await props.addQuestion(newDesc, newTitle, newSummary);

    try {
      const response = await axios.post(
        `http://localhost:8000/users/${currentUserId}/questions/${q_id}`,
        { withCredentials: true }
      );
      if (response.status !== 200) {
        throw new Error("Failed to link question to user");
      }
    } catch (error) {
      console.error("Error linking question to user:", error);
      return;
    }
    var newTags = document.getElementById("question-tags").value;
    newTags = newTags.split(" ");
    //newTags = newTags.filter((val,index)=> newTags.indexOf(val)===index);
    if (newTags.length === 0) {
      window.alert("at least 1 Tag is required");
      return;
    }
    if (newTags.length > 5) {
      window.alert("There can be 5 tags at most");
      return;
    }
    let n_Tags = [];
    for (let i = 0; i < newTags.length; i++) {
      n_Tags.push(newTags[i].toLowerCase());
      if (newTags[i].length > 10) {
        window.alert("Tag length must be a max of 10");
        return;
      }
    }

    newTags = [...new Set(n_Tags)];
    console.log(newTags);

    let t = [];
    let thold = [];
    for (let i = 0; i < props.tags.length; i++) {
      thold.push(props.tags[i].name);
    }

    for (let i = 0; i < newTags.length; i++) {
      if (thold.indexOf(newTags[i]) !== -1) {
        for (let j = 0; j < props.tags.length; j++) {
          if (newTags[i] === props.tags[j].name) {
            t.push(props.tags[j].name);

            async function getTagByName(tagName) {
              try {
                const response = await axios.get(
                  `http://localhost:8000/tags/${tagName}`,
                  {
                    params: {
                      name: tagName,
                    },
                  }
                );

                if (response.status === 200 && response.data) {
                  try {
                    props.addToTagArr(response.data, q_id);
                  } catch (error) {}
                } else {
                  throw new Error(`Failed to fetch tag with name: ${tagName}`);
                }
              } catch (error) {
                console.error("Error fetching tag:", error);
                return null;
              }
            }
            getTagByName(newTags[i]);
            console.log(
              newTags[i] + "THIS IS THE id 104444443214123321323132121332"
            );
          }
        }
      } else {
        t.push("t" + (props.tags.length + 1).toString());

        // let newT = {
        //   // tid: "t" + (props.tags.length + 1).toString(),
        //   name: newTags[i],
        // };
        // model.addTags(newT);
        //props.addTag(newTags[i], q_id);
      }
    }

    // remember to check other cases for tags later

    // model.addQuestions(newQ);
    // // model.data.tags.forEach((element) => {
    // //   tags[element.tid] = element.name;
    // // });
    // console.log(model.data.questions);
    // console.log(model.data.tags);
    // fakeStackOverflow.state =<CreateHomePage/>
    //<App updatePage={<CreateHomePage/>}/>
    props.editQuestion(
      props.currentQ._id,
      newTitle,
      newDesc,
      newTags,
      newSummary
    );
    props.onUpdate(2);
    props.refreshData();
    //props.modelChange(model);
    // questionCreate(newQ);
  }
  return (
    <div className="Question-Page container" id="Qp">
      <CreateLeftMenu updateFunc={props.onUpdate} />
      <form>
        <fieldset>
          <p className="title" id="title">
            Question Title
          </p>
          <p className="desc" id="desc">
            Limit title to 100 characters or less
          </p>
          <input
            type="text"
            id="question-title"
            name="question-title"
            required
          />
          <p className="title">Summary</p>
          <p className="desc" id="desc">
            Limit title to 100 characters or less
          </p>
          <input
            type="text"
            id="question-summary"
            name="question-summary"
            required
          />
          <p className="title">Question Text</p>
          <p className="desc">Add details</p>
          <input type="text" id="question-text" name="question-text" required />
          <p className="title">Tags</p>
          <p className="desc">Add keywords separated by whitespace</p>
          <input type="text" id="question-tags" name="question-tags" required />
          <button type="button" id="question-btn" onClick={() => handleClick()}>
            Ask Questions
          </button>
        </fieldset>
      </form>
    </div>
  );
}

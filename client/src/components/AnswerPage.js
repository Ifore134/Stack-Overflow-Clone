import CreateLeftMenu from "./LeftMenu.js";
import axios from "axios";

export default function CreateAnswerPage(props) {
  //let qs = props.questions;
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
    let newText = document.getElementById("answer-text").value;
    if (newText.length === 0) {
      window.alert("Text is required");
      return;
    }
    if (!validateHyperlinks(newText)) {
      window.alert(
        "Invalid hyperlink format. Hyperlinks must be in the format [text](link) and start with 'https://' or 'http://'."
      );
      return;
    }

    let newUser;
    try {
      const response = await axios.get("http://localhost:8000/session", {
        withCredentials: true,
      });
      if (response.status === 200) {
        newUser = response.data.session.userId;
      } else {
        throw new Error("Failed to fetch current user");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      return;
    }

    let vq = props.viewQuestion;

    
    console.log(vq._id);
    console.log(newUser);
    await props.addAnswers(newText, newUser, vq._id);
    props.refreshData();
    props.onUpdate(2);
  }
  return (
    <div className="Answer-Page container" id="Ap">
      <CreateLeftMenu updateFunc={props.onUpdate} />
      <form>
        <fieldset>
          <p className="title">Answer Text*</p>
          <input
            type="text"
            id="answer-text"
            name="answer-text"
            placeholder="Input answer text here ..."
            required
          />
          <button type="button" onClick={() => handleClick()}>
            Post Answer
          </button>
          <p className="warning">*indicates mandatory fields</p>
        </fieldset>
      </form>
    </div>
  );
}

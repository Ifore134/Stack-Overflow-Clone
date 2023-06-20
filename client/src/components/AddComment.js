export default function CreateCommentPage(props){
    return (
        <div className="Answer-Page container" id="Ap">
          
          <form>
            <fieldset>
              
              <input
                type="text"
                id="comment-username"
                name="answer-username"
                placeholder="Input Username here..."
                required
              />
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
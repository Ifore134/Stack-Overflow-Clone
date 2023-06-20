export default function CreateCommentViewer(props){
    let liked = false;
    if (props.isQ===true){
    let Q= props.viewQuestion;
    let relatedComments=[]
    for(let i=0; i<props.comments.length;i++){
        console.log(Q,"herer");
        console.log(props.comments[i].question,"here")
        if (props.comments[i].question===Q._id){
            relatedComments.push(props.comments[i])
        }
    }
    console.log(relatedComments);

    const handleUpVote = async (commentId, comment) => {
        if(props.guest===false){
            await props.onUpdateVote(commentId, "up", comment);
          liked = true;
          props.refreshData();
        }
        else{
            alert("guests can't upvote")
        }
          
        
      };
    
      const handleDownVote = async (commentId, comment) => {
        if(props.guest===false){
          await props.onUpdateVote(commentId, "down", comment);
          liked = true;
          props.refreshData();
        }
        else{
            alert("guests can't downvote")
        }
          
        
      };        

    return(
        <table>
            {relatedComments.map((comment)=>(
                <div>
                <tr>{comment.body}</tr>
                <td>Upvotes: {comment.votes}</td>
                <div>
                  <button onClick={() => handleUpVote(comment._id, comment)}>
                    Upvote
                  </button>
                  <button onClick={() => handleDownVote(comment._id, comment)}>
                    Downvote
                  </button>
                </div>
                </div>
            )
            )}
        </table>
    );
    }
    else{
        let Q= props.viewAnswer;
    let relatedComments=[]
    for(let i=0; i<props.comments.length;i++){
        //console.log(Q,"herer");
        //console.log(props.comments[i].question,"here")
        if (props.comments[i].answer===Q._id){
            relatedComments.push(props.comments[i])
        }
    }
    console.log(relatedComments);
    const handleUpVote = async (commentId, comment) => {
        if (liked === false) {
          await props.onUpdateVote(commentId, "up", comment);
          liked = true;
          props.refreshData();
        }
      };
    
      const handleDownVote = async (commentId, comment) => {
        if (liked === false) {
          await props.onUpdateVote(commentId, "down", comment);
          liked = true;
          props.refreshData();
        }
      };        
    return(
        <table>
            {relatedComments.map((comment)=>(
                <div>
                <tr>{comment.body}</tr>
                <td>Upvotes: {comment.votes} </td>
                <div>
                  <button onClick={() => handleUpVote(comment._id, comment)}>
                    Upvote
                  </button>
                  <button onClick={() => handleDownVote(comment._id, comment)}>
                    Downvote
                  </button>
                </div>
                </div>
            )
            )}
        </table>
    );
    }
    
}
import CreateLeftMenu from "./LeftMenu.js";

//let model = new Model();
export default function CreateTagsPage(props) {
  //let model = props.newmodel;
  let tgs = props.tags;
  let qs = props.questions;

  function handleClick(sear) {
    props.search("[" + sear + "]");
    props.onUpdate(6);
  }

  function numOfTags(tg) {
    let val = tg._id;
    console.log(tg.name)
    let count = 0;
    for (let i = 0; i < qs.length; i++) {
      for (let j = 0; j < qs[i].tags.length; j++) {
        
        if (qs[i].tags[j] === val) {
          count++;
        }
      }
    }
    console.log(qs[0].tags[0],"oyoyoyoyoyooy")
    console.log(val, "hiihihihihihihihihhihihii")
    
    return count;
  }

  function Table() {
    //const tags = model.data.tags;
    const tags = tgs;
    const rows = [];
    let row = [];
    let comp =[]
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      if (comp.includes(tag.name)){
        continue;
      }
      else{
        comp.push(tag.name);
      }
      row.push(
        <td key={tag.name} className="tag-td">
          <div id="tt-td">
            <a id="tagtable-link" onClick={() => handleClick(tag.name)}>
              <p>{tag.name}</p>
            </a>
            <p>{numOfTags(tag)} questions</p>
          </div>
        </td>
      );
      if (row.length === 3 || i === tags.length - 1) {
        rows.push(<tr key={i}>{row}</tr>);
        row = [];
      }
    }
    return (
      <table className="tag-table">
        <tbody>{rows}</tbody>
      </table>
    );
  }

  function handleQ() {
    props.onUpdate(1);
  }

  return (
    <div className="tp-Page container" id="tp">
      <CreateLeftMenu updateFunc={props.onUpdate} activeSection="tags" />
      <div>
        <div className="tag-page" id="tag-page">
          <h1 id="tagnum">{tgs.length} Tags</h1>
          <h1 id="tpage-head">All Tags</h1>

          <button className="btn" id="hpq-button" onClick={() => handleQ()}>
            Ask Questions
          </button>
          <Table />
        </div>
      </div>
    </div>
  );
}

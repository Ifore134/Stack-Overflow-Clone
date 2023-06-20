export default function Header(props) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      props.onUpdate(6);
      props.changeSearch(e.target.value);
    }
  };

  return (
    <div id="header" className="header">
      <h1>Fake Stack Overflow</h1>
      <input
        type="text"
        placeholder="Search..."
        className="search-bar"
        id="search-bar"
        // value={searchQuery}
        // onChange={(e) => {
        //   props.changeSearch(e.target.value);
        // }}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
}

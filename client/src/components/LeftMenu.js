import axios from "axios";

export default function CreateLeftMenu({ updateFunc, activeSection }) {
  const questionStyle =
    activeSection === "questions"
      ? { backgroundColor: "rgb(211, 211, 211)" }
      : {};
  const tagsStyle =
    activeSection === "tags" ? { backgroundColor: "rgb(211, 211, 211)" } : {};

  const handleProfileClick = () => {
    axios
      .get("http://localhost:8000/session", { withCredentials: true })
      .then((response) => {
        if (response.data.session && response.data.session.userId) {
          return axios.get(
            `http://localhost:8000/user-role/${response.data.session.userId}`
          );
        } else {
          throw new Error("User not logged in");
        }
      })
      .then((response) => {
        if (response.data.isAdmin) {
          updateFunc(10);
        } else {
          updateFunc(11);
        }
      })
      .catch((error) => {
        console.error("Error getting user role:", error);
      });
  };

  return (
    <div className="left-menu">
      <a
        className="menu-link1"
        onClick={() => updateFunc(2)}
        style={questionStyle}
      >
        Questions
      </a>
      <a className="menu-link2" onClick={() => updateFunc(4)} style={tagsStyle}>
        Tags
      </a>
      <a className="menu-link2" onClick={handleProfileClick} style={tagsStyle}>
        Profile
      </a>
    </div>
  );
}

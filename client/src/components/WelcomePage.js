import LoginPage from "./LoginPage";
export default function CreateWelcomePage(props) {
  function bringLogin() {
    props.refreshData();

    props.onUp(8);
  }
  function bringRegister() {
    props.refreshData();

    props.onUp(9);
  }
  function bringGuest() {
    props.refreshData();
    props.setGuest(true);
    props.onUp(2);
  }
  return (
    <div>
      <h1>Welcome to Fake Stack Overflow</h1>
      <p>fill out the text below to login</p>
      <button onClick={() => bringLogin()}>Click here to login</button>
      <button onClick={() => bringRegister()}>Click here to register</button>
      <button onClick={() => bringGuest()}>
        Click here to continue as guest
      </button>
    </div>
  );
}

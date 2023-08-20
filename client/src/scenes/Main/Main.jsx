import "./Main.css";
import PlayArea from "./PlayArea/PlayArea.jsx";
import NavBar from "../../components/NavBar/NavBar.jsx";

const Main = (props) => {
  return (
    <div className="Main">
      <NavBar/>
      <PlayArea isAuth={props.isAuth} user={props.user} token={props.token}/>
    </div>
  );
};

export default Main;

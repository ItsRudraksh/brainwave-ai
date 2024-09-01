import { Link } from "react-router-dom";
import User from "./User";
import { brainwave } from "../assets";

const HeaderMini = ({ classNames = "" }) => {
  return (
    <header
      className={`flex items-center justify-between p-4 lg:pr-8 ${classNames}`}
    >
      <Link to="/">
        <img
          src={brainwave}
          className="logo object-cover"
          alt="logo"
          width={100}
        />
      </Link>
      <div className="user text-xs flex gap-6">
        <User />
      </div>
    </header>
  );
};

export default HeaderMini;

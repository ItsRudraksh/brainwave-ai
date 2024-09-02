/* import { useEffect, useState } from "react";
import axios from "axios";
import Logout from "./Logout";
import { LogOut, Triangle } from "lucide-react";
const User = ({ onUserLoaded, bgColor }) => {
  const [username, setUsername] = useState("");
  const [profileBox, setProfileBox] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/user`,
          {
            withCredentials: true,
          }
        );
        setUsername(response.data.username);
        if (onUserLoaded) onUserLoaded(response.data.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [onUserLoaded]);

  const handleProfileClick = () => {
    setProfileBox(!profileBox);
    window.addEventListener("mousedown", () => {
      setProfileBox(false);
    });
  };

  const backgroundColor = bgColor ? `#${bgColor}` : "#ac6aff";
  const additionalStyles = bgColor ? "mb-3" : "";

  return (
    <div className="relative">
      <div
        onClick={handleProfileClick}
        className={`rounded-full flex items-center justify-center w-8 h-8 cursor-pointer relative ${additionalStyles}`}
        style={{ backgroundColor }}
        title={`Hi, ${username} !!`}
      >
        {username ? username.toUpperCase().charAt(0) : "U"}
      </div>
      <div
        className={`absolute top-full -translate-y-3 -translate-x-1 right-0 whitespace-nowrap flex-col items-end justify-center transition-all ${
          profileBox ? "flex visible" : "invisible"
        }`}
      >
        <Triangle
          fill="#2c2937"
          stroke="#2c2937"
          className="relative translate-y-3 translate-x-[1.1px] -z-10"
        />
        <div
          className={`bg-[#2c2937] p-3 rounded-lg flex flex-col items-end justify-center gap-1 text-base lg:text-lg`}
        >
          <p>Hi, {username ? username : "User"}</p>
          <div
            title="Logout User"
            className="hover:bg-[#0e0c15] w-full flex items-center justify-end gap-2 p-1 lg:p-2 rounded-md transition-colors cursor-pointer border-b border-r border-opacity-50 border-white hover:border-opacity-70 lg:text-lg"
          >
            <Logout />
            <LogOut />
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
 */
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Logout from "./Logout";
import { LogOut, Triangle } from "lucide-react";

const User = ({ onUserLoaded, bgColor }) => {
  const [username, setUsername] = useState("");
  const [profileBox, setProfileBox] = useState(false);
  const profileBoxRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/user`,
          {
            withCredentials: true,
          }
        );
        setUsername(response.data.username);
        if (onUserLoaded) onUserLoaded(response.data.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [onUserLoaded]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileBoxRef.current && !profileBoxRef.current.contains(e.target)) {
        setProfileBox(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setProfileBox((prevState) => !prevState);
  };

  const backgroundColor = bgColor ? `#${bgColor}` : "#ac6aff";
  const additionalStyles = bgColor ? "mb-3" : "";

  return (
    <div className="relative">
      <div
        onClick={handleProfileClick}
        className={`rounded-full flex items-center justify-center w-8 h-8 cursor-pointer relative ${additionalStyles}`}
        style={{ backgroundColor }}
        title={`Hi, ${username} !!`}
      >
        {username ? username.toUpperCase().charAt(0) : "U"}
      </div>
      {profileBox && (
        <div
          ref={profileBoxRef}
          className={`absolute top-full -translate-y-3 -translate-x-1 right-0 whitespace-nowrap flex-col items-end justify-center transition-all flex visible`}
        >
          <Triangle
            fill="#2c2937"
            stroke="#2c2937"
            className="relative translate-y-3 translate-x-[1.1px] -z-10"
          />
          <div
            className={`bg-[#2c2937] p-3 rounded-lg flex flex-col items-end justify-center gap-1 text-base lg:text-lg`}
          >
            <p>Hi, {username ? username : "User"}</p>
            <div
              onClick={() => console.log("Logout User")}
              id="logout-btn"
              title="Logout User"
              className="hover:bg-[#0e0c15] w-full flex items-center justify-end gap-2 p-1 lg:p-2 rounded-md transition-colors cursor-pointer border-b border-r border-opacity-50 border-white hover:border-opacity-70 lg:text-lg"
            >
              <Logout />
              <LogOut />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;

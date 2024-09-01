import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import HeaderMini from "../components/HeaderMini";
import HeroMini from "../components/HeroMini";
import { robot } from "../assets";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signup`,
        { username, email, password },
        { withCredentials: true }
      );
      // console.log(response.data);
      navigate("/dashboard"); // Redirect to dashboard after successful signup
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during signup"
      );
    }
  };

  return (
    <div className="login-container w-screen h-screen overflow-hidden">
      <HeaderMini classNames="w-full fixed top-0 z-50 h-20 px-8 bg-[#0e0c15] bg-opacity-70 backdrop-blur-sm" />
      <div className="w-full h-full">
        <HeroMini>
          {error && <p className="error">{error}</p>}
          <form
            onSubmit={handleSubmit}
            className="backdrop-blur-sm md:bg-[#ad6aff21] relative z-40 w-full flex flex-col md:flex-row items-center justify-evenly gap-6 p-5 lg:-translate-y-4 rounded-md"
          >
            <img
              src={robot}
              className="hidden md:block h-[600px] md:h-[500px] w-[600px] md:w-[500px] object-cover rounded-md"
              alt="AI"
            />
            <div className="bg-[#bd9fac85] rounded-md grid place-items-center place-content-evenly gap-6 p-5 h-[450px] mt-10 md:mt-0">
              <h1 className="text-center font-extrabold mb-3 text-4xl tracking-tight font-grotesk">
                SignUp Here
              </h1>
              <div className="flex flex-col w-[220px]">
                <label htmlFor="username">Username:</label>
                <input
                  autoComplete="off"
                  className="bg-transparent border-b-2 border-solid border-[#fffff2] outline-none"
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col w-[220px]">
                <label htmlFor="email">Email:</label>
                <input
                  autoComplete="off"
                  className="bg-transparent border-b-2 border-solid border-[#fffff2] outline-none"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col w-[220px]">
                <label htmlFor="password">Password:</label>
                <input
                  autoComplete="off"
                  className="bg-transparent border-b-2 border-solid border-[#fffff2] outline-none"
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg--100 rounded-md font-code text-xl"
              >
                Sign Up
              </button>
              <div className="flex flex-col items-center gap-2">
                <p>
                  {"Already have an accout?"} <Link to="/login">Login !!</Link>
                </p>
                <p>
                  <Link to="/">Back Home</Link>
                </p>
              </div>
            </div>
          </form>
        </HeroMini>
      </div>
    </div>
  );
};

export default Signup;

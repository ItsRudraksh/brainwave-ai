import { useNavigate } from "react-router-dom";
import axios from "axios";
const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
      console.log("Logged out user");
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default Logout;

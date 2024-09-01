import { useNavigate } from "react-router-dom";
import axios from "axios";
const Logout = ({ onLogout }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
      if (onLogout) {
        onLogout();
      }
      // Optionally, clear any client-side state or local storage here
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

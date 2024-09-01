import { Outlet, useNavigate } from "react-router-dom";
import ChatList from "../../components/ChatList";
import { useEffect, useState } from "react";
import axios from "axios";
import HeaderMini from "../../components/HeaderMini";
import Loader from "../../components/Loader";
import { Menu, X } from "lucide-react";
const DashboardLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/protected`,
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
      } catch (error) {
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isLoading) return <Loader />;
  return (
    <div className="w-screen h-screen lg:pl-4 lg:pr-0">
      <HeaderMini classNames="fixed top-0 z-[100] w-full h-14 bg-[#0e0c15]" />
      <div className="dashboardLayout flex gap-[50px] pt-5 h-full">
        <div
          className={`menu flex-1 h-[687px] lg:h-auto bg-[#0e0c15] z-50 absolute bottom-0 lg:relative lg:bg-transparent lg:z-0 lg:translate-x-0 transition-all ${
            isMenuOpen ? "-translate-x-0 pl-3 pt-5" : "-translate-x-full"
          } `}
        >
          {isMenuOpen && (
            <button
              onClick={handleMenuClick}
              className={`absolute z-50 bg-[#2c2937] right-5 p-3 rounded-lg lg:hidden ${
                isMenuOpen ? "" : "hidden"
              }`}
            >
              <X />
            </button>
          )}
          <ChatList handleMenu={setIsMenuOpen} />
        </div>
        <div className="content flex-[4] bg-[#151223] relative">
          <button
            onClick={handleMenuClick}
            className={`absolute z-30 top-15 left-3 bg-[#2c2937] p-3 rounded-lg lg:hidden ${
              isMenuOpen ? "hidden" : ""
            }`}
          >
            <Menu />
          </button>
          {isMenuOpen && (
            <div
              onClick={handleMenuClick}
              className="w-full h-full bg-black bg-opacity-40 absolute z-[45]"
            ></div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

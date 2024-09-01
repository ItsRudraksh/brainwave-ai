import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Homepage from "./routes/Homepage";
import Dashboard from "./routes/Dashboard";
import Chat from "./routes/Chat";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import RootLayout from "./layouts/RootLayout/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import NotFound from "./components/NotFound";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/login/*",
        element: <Login />,
      },
      {
        path: "/signup/*",
        element: <Signup />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <Chat />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

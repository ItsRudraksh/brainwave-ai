import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <h1 className="text-6xl font-bold text-center text-gray-800 mb-4">
          404
        </h1>
        <p className="text-2xl text-center text-gray-600 mb-8">
          Page Not Found
        </p>
        <p className="text-center text-gray-500 mb-8">
          {"The page you're looking for doesn't exist or has been moved."}
        </p>
        <div className="flex justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

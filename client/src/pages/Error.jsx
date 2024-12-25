import React from "react";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();

  const handleClick = () =>{
    navigate("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-blue-700 p-4">
      <div className="text-center max-w-md">
        <img
          src="error.jpg"
          alt="404 Error"
          className="mx-auto mb-8 w-3/4 md:w-1/2 lg:w-1/3"
        />
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Oops!</h1>
        <p className="text-lg md:text-xl mb-6">
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={handleClick}
          className="px-6 py-3 text-lg bg-blue-700 text-white rounded-lg shadow-lg hover:bg-blue-800 transition-transform transform hover:scale-105"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;

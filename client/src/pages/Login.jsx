import { useState,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {useNavigate} from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem("Token");

    if(token)
      {
        navigate("/dashboard");
      }
  },[])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onSubmit = async (data) => {
    try {
      // Sending POST request to the backend with the login data
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Sending the form data as JSON in the request body
      });
  
      // Checking if the response is successful
      if (response.ok) {
        const responseData = await response.json(); // Parse the response as JSON
        console.log('Backend Response:', responseData);
        localStorage.setItem("Token",responseData.token);
        reset();

        if(responseData.user.role == "admin")
        {
          navigate("/accept-reject")
        }
        else if(responseData.user.role == "organizer")
        {
          navigate("/book-event");
        }
        else{
          navigate("/organization");
        }
      

        
        // Handle the response (e.g., store the token, redirect user, etc.)
      } else {
        const errorData = await response.json(); // Parse error response
        console.log('Error:', errorData);
        // Handle the error (e.g., display error message to the user)
      }
    } catch (error) {
      console.error('Error in sending login request:', error);
    }
  };
  

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css?family=Exo:400,700');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Exo', sans-serif; margin: 0; padding: 0; }
        .area { 
            background:#62b4e7;
            background: -webkit-linear-gradient(to left, #8f94fb, #4e54c8);
            width: 100%; min-height: 100vh; position: absolute;
            top: 0; left: 0; z-index: 0; overflow: hidden; 
        }

        .circles { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; }
        .circles li { position: absolute; display: block; list-style: none; width: 20px; height: 20px; background: rgba(71, 92, 233, 0.2); animation: animate 25s linear infinite; bottom: -150px; border-radius: 50%; }
        .circles li:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 2s; }
        .circles li:nth-child(2) { left: 10%; width: 40px; height: 40px; animation-delay: 2s; animation-duration: 8s; }
        .circles li:nth-child(3) { left: 70%; width: 20px; height: 20px; animation-delay: 4s; }
        .circles li:nth-child(4) { left: 40%; width: 60px; height: 60px; animation-delay: 0s; animation-duration: 8s; }
        .circles li:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s; }
        .circles li:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s; }
        .circles li:nth-child(7) { left: 35%; width: 150px; height: 150px; animation-delay: 7s; }
        .circles li:nth-child(8) { left: 50%; width: 25px; height: 25px; animation-delay: 15s; animation-duration: 30s; }
        .circles li:nth-child(9) { left: 20%; width: 15px; height: 15px; animation-delay: 2s; animation-duration: 25s; }
        .circles li:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 0s; animation-duration: 7s; }
        @keyframes animate { 
            0% { transform: translateY(0) rotate(0deg); opacity: 1; border-radius: 0; } 
            100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; border-radius: 50%; }
        }
        .login-container { position: relative; z-index: 10; display: flex; justify-content: center; align-items: center; height: 100vh; }
        .password-wrapper { position: relative; width: 100%; }
        .toggle-visibility {
            position: absolute;
            top: 50%; right: 1rem;
            transform: translateY(-50%);
            cursor: pointer;
        }
        .login-form { 
            background-color: white; padding: 2rem; border-radius: 8px; 
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
            display: flex; flex-direction: column; justify-content: center; 
            align-items: center; width: 100%; max-width: 500px; z-index: 50; 
        }
      `}
      </style>
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div className="login-container">
        <div className="bg-white p-8  bg-opacity-20 rounded-lg shadow-lg w-full max-w-4xl flex flex-col md:flex-row relative z-10 bounce-in-top">
          <div className="md:w-1/2 flex items-center justify-center p-4">
            <img alt="An illustration of event management with people organizing and attending an event" className="rounded-lg" height="400" src="login.svg" width="400"/>
          </div>
          <div className="md:w-1/2 p-4 flex flex-col justify-center">
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="h-full flex flex-col justify-center">
                <legend className="text-3xl font-bold mb-6 text-center text-white">
                  Welcome Back!
                </legend>
                <div className="mb-4">
                  <label className="block text-white font-semibold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="mb-6 password-wrapper">
                  <label className="block text-white font-semibold mb-2" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      required
                      type={passwordVisible ? 'text' : 'password'}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                    />
                    <span
                      className="toggle-visibility text-white absolute right-5 text-xl"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? '🐵' : '🙈'}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <button
                  className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white p-3 rounded-lg font-semibold hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition-all duration-300"
                  type="submit"
                >
                  Login
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

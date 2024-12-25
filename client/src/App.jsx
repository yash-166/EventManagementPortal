import { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
// import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import { setUser } from "./redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Mobilesidebar from "./components/MobileSidebar"
import ManageEvents from "./pages/ManageEvents";
import BookEvents from "./pages/BookEvents";
import Events from "./pages/Events";
import Organization from "./pages/Organization";
import AcceptReject from "./pages/AcceptReject";
import Register from "./pages/Register"

function Layout() {
  const dispatch = useDispatch();
  const mobilesidebar = useSelector((state) => state.auth.isSidebarOpen);
  // const user = useSelector((state) => state.auth.user);
  // const location = useLocation();

  const navigate = useNavigate();

  const token = localStorage.getItem("Token");

  // Redirect to login if no token exists
  useEffect(() => {
    if (!token) {
      navigate("/log-in");
    }
  }, [token, navigate]);

  useEffect(() => {
    async function fetching() {
      if (!token) {
        console.error("No token found. Cannot fetch user data.");
        return;
      }

      try {
        console.log("app component");
        const response = await fetch("http://localhost:3000/api/users/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(await response.json());
        if (response.ok) {
          const result = await response.json();
          dispatch(setUser(result.user)); // Set user data in Redux store
          localStorage.setItem("user",result.user.role);
        } else if (response.status === 401 || response.status === 403) {
          console.error("Token is invalid or expired. Redirecting to login.");
          localStorage.removeItem("Token"); // Clear the invalid/expired token
          navigate("/log-in");
        } else {
          const error = await response.json();
          console.error("Failed to fetch user data:", error.message || response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    }

    fetching();
  }, [dispatch, token, navigate]);

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block">
        <Sidebar />
      </div>

      {mobilesidebar && <Mobilesidebar />}

      <div className="flex-1 overflow-y-auto">
        <Navbar />

        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <main className="w-full min-h-screen bg-[#f3f4f6]">
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage-events" element={<ManageEvents />} />
          <Route path="/book-event" element={<BookEvents />} />
          <Route path="/events" element={<Events />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/accept-reject" element={<AcceptReject />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/log-in" element={<Login />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeButton={true}
        pauseOnHover={true}
      />
    </main>
  );
}

export default App;




// import { useEffect } from "react";
// import { Routes, Route, Navigate, Outlet } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import Dashboard from "./pages/Dashboard";
// import { ToastContainer } from "react-toastify";
// import Login from "./pages/Login";
// import { setUser } from "./redux/slices/authSlice";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar";
// import Mobilesidebar from "./components/MobileSidebar";
// import ManageEvents from "./pages/ManageEvents";
// import BookEvents from "./pages/BookEvents";
// import Events from "./pages/Events";
// import Organization from "./pages/Organization";
// import AcceptReject from "./pages/AcceptReject";
// import Register from "./pages/Register";
// import Error from "./pages/Error";

// function Layout() {
//   const dispatch = useDispatch();
//   const mobilesidebar = useSelector((state) => state.auth.isSidebarOpen);
//   const user = useSelector((state) => state.auth.user);

//   const navigate = useNavigate();
//   const token = localStorage.getItem("Token");

//   // Redirect to login if no token exists
//   useEffect(() => {
//     if (!token) {
//       navigate("/log-in");
//     }
//   }, [token, navigate]);

//   useEffect(() => {
//     async function fetching() {
//       if (!token) {
//         console.error("No token found. Cannot fetch user data.");
//         return;
//       }

//       try {
//         const response = await fetch("http://localhost:3000/api/users/user", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const result = await response.json();
//           dispatch(setUser(result.user)); // Set user data in Redux store
//         } else if (response.status === 401 || response.status === 403) {
//           console.error("Token is invalid or expired. Redirecting to login.");
//           localStorage.removeItem("Token"); // Clear the invalid/expired token
//           navigate("/log-in");
//         } else {
//           const error = await response.json();
//           console.error("Failed to fetch user data:", error.message || response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error.message);
//       }
//     }

//     fetching();
//   }, [dispatch, token, navigate]);

//   return (
//     <div className="w-full h-screen flex flex-col md:flex-row">
//       <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block">
//         <Sidebar />
//       </div>

//       {mobilesidebar && <Mobilesidebar />}

//       <div className="flex-1 overflow-y-auto">
//         <Navbar />
//         <div className="p-4 2xl:px-10">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }

// // Component to handle role-based access
// function PrivateRoute({ allowedRoles, children }) {
//   const user = useSelector((state) => state.auth.user);

//   if (!user || !allowedRoles.includes(user.role)) {
//     return <Navigate to="/error" />;
//   }

//   return children;
// }

// function App() {
//   return (
//     <main className="w-full min-h-screen bg-[#f3f4f6]">
//       <Routes>
//         {/* Layout for authenticated routes */}
//         <Route element={<Layout />}>
//           <Route
//             path="/"
//             element={<Navigate to="/dashboard" />}
//           />
//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute allowedRoles={["admin", "organizer"]}>
//                 <Dashboard />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/manage-events"
//             element={
//               <PrivateRoute allowedRoles={["organizer"]}>
//                 <ManageEvents />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/book-event"
//             element={
//               <PrivateRoute allowedRoles={["organizer"]}>
//                 <BookEvents />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/events"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <Events />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/organization"
//             element={
//               <PrivateRoute allowedRoles={["student", "admin", "organizer"]}>
//                 <Organization />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/accept-reject"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <AcceptReject />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/register"
//             element={
//               <PrivateRoute allowedRoles={["student"]}>
//                 <Register />
//               </PrivateRoute>
//             }
//           />
//         </Route>

//         <Route path="/error" element={<Error />} />
//         <Route path="*" element={<Error />} />

//         {/* Public routes */}
//         <Route path="/log-in" element={<Login />} />

//         {/* Catch-all for undefined or unauthorized routes */}
       
//       </Routes>

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         closeButton={true}
//         pauseOnHover={true}
//       />
//     </main>
//   );
// }

// export default App;

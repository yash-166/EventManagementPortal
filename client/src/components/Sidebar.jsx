// // import React from "react";
// import {
//     MdDashboard,
//     MdOutlinePendingActions,
//     MdSettings,
//     MdTaskAlt,
//   } from "react-icons/md";
//   import { GoTasklist } from "react-icons/go";
//   import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
//   import { useDispatch, useSelector } from "react-redux";
//   import { Link, useLocation } from "react-router-dom";
//   import { setOpenSidebar } from "../redux/slices/authSlice";
//   import clsx from "clsx";
  
//   import PropTypes from 'prop-types';
  
//   const linkData = [
//     {
//       label: "Dashboard",
//       link: "dashboard",
//       icon: <MdDashboard />,
//     },
//     {
//       label: "Tasks",
//       link: "tasks",
//       icon: <FaTasks />,
//     },
//     {
//       label: "Completed",
//       link: "completed/completed",
//       icon: <MdTaskAlt />,
//     },
//     {
//       label: "In Progress",
//       link: "in-progress/in progress",
//       icon: <MdOutlinePendingActions />,
//     },
//     {
//       label: "To Do",
//       link: "todo/todo",
//       icon: <MdOutlinePendingActions />,
//     },
//     {
//       label: "Team",
//       link: "team",
//       icon: <FaUsers />,
//     },
//     {
//       label: "Trash",
//       link: "trashed",
//       icon: <FaTrashAlt />,
//     },
//   ];
  
//   const Sidebar = () => {
//     const { user } = useSelector((state) => state.auth);
  
//     const dispatch = useDispatch();
//     const location = useLocation();
  
  
//     const path = location.pathname.split("/")[1];
  
  
//     const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);
  
//     const closeSidebar = () => {
//       dispatch(setOpenSidebar(false));
//     };
  
//     const NavLink = ({ el }) => {
//       return (
//         <Link
//           to={el.link}
//           onClick={closeSidebar}
//           className={clsx(
//             "w-full lg:w-3/4 flex gap-2 px-2 py-2 rounded-tr-xl items-center text-gray-800 text-base hover:bg-[#2564ed2d] hover:text-blue-500",
//             path === el.link.split("/")[0] ? "bg-blue-500 text-neutral-100" : ""
//           )}
//         >
//           {el.icon}
//           <span>{el.label}</span>
//         </Link>
//       );
//     };
//     NavLink.propTypes = {
//       el: PropTypes.shape({
//         label: PropTypes.string.isRequired,
//         link: PropTypes.string.isRequired,
//         icon: PropTypes.node.isRequired,
//       }).isRequired,
//     };
//     return (
//       <div className='w-full  h-full flex flex-col gap-6 p-2 pt-4'>
//         <h1 className='flex gap-1 items-center'>
//           <p className='bg-blue-500 p-2 rounded-full'>
//             <GoTasklist className='text-white text-2xl font-black' />
//           </p>
//           <span className='text-2xl font-bold text-black'>EventManagement</span>
//         </h1>
  
//         <div className='flex-1 flex flex-col gap-y-5 py-4'>
//           {sidebarLinks.map((link) => (
//             <NavLink el={link} key={link.label} />
//           ))}
//         </div>
  
//         <div className=''>
//           <button className='w-full flex gap-2 p-2 items-center text-lg text-gray-800'>
//             <MdSettings />
//             <span>Settings</span>
//           </button>
//         </div>
//       </div>
//     );
//   };
  
//   export default Sidebar;




import {
  MdDashboard,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import { FaTasks, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import clsx from "clsx";

import PropTypes from 'prop-types';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const location = useLocation();

  const path = location.pathname.split("/")[1];

  let sidebarLinks = [];

  // Conditional links based on user role
  if (user?.role === "organizer") {
    sidebarLinks = [
      { label: "Book an Event", link: "book-event", icon: <MdTaskAlt /> },
      { label: "Dashboard", link: "dashboard", icon: <MdDashboard /> },
     
      { label: "Manage Events", link: "manage-events", icon: <FaTasks /> },
    ];
  } else if (user?.role === "admin") {
    sidebarLinks = [
      { label: "Accept/Reject", link: "accept-reject", icon: <MdOutlinePendingActions /> },
      { label: "Dashboard", link: "dashboard", icon: <MdDashboard /> },
   
      { label: "Organization", link: "organization", icon: <FaUsers /> },
      { label: "Events", link: "events", icon: <FaTasks /> },
    ];
  } else if (user?.role === "student") {
    sidebarLinks = [
      { label: "Organization", link: "organization", icon: <FaTasks /> },
      { label: "Register", link: "register", icon: <MdTaskAlt /> },
    ];
  }

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => {
    return (
      <Link
        to={el.link}
        onClick={closeSidebar}
        className={clsx(
          "w-full lg:w-3/4 flex gap-2 px-2 py-2 rounded-tr-xl items-center text-gray-800 text-base hover:bg-[#2564ed2d] hover:text-blue-500",
          path === el.link.split("/")[0] ? "bg-blue-500 text-neutral-100" : ""
        )}
      >
        {el.icon}
        <span>{el.label}</span>
      </Link>
    );
  };

  NavLink.propTypes = {
    el: PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
    }).isRequired,
  };

  return (
    <div className='w-full h-full flex flex-col gap-6 p-2 pt-4'>
      <h1 className='flex gap-1 items-center'>
        <p className='bg-blue-500 p-2 rounded-full'>
          <GoTasklist className='text-white text-2xl font-black' />
        </p>
        <span className='text-2xl font-bold text-black'>EventManagement</span>
      </h1>

      <div className='flex-1 flex flex-col gap-y-5 py-4'>
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      {/* <div className=''>
        <button className='w-full flex gap-2 p-2 items-center text-lg text-gray-800'>
          <MdSettings />
          <span>Settings</span>
            <img src="eventhappy.jpg" alt="" />
        </button>
      
      </div> */}
    </div>
  );
};

export default Sidebar;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    sort: "desc", // Default to dates descending
    organizer: "",
    branch: "",
    year: "",
  });

  const branches = ["PUC", "CSE", "ECE", "EEE", "Mechanical", "Civil", "Chemical"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i); // From 2000 to current year

  // Fetch Events Function
  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/events", { params: filters });
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Events</h1>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className="border rounded p-3 shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="desc" className="text-blue-800 ">Date Descending</option>
          <option value="asc" className="text-blue-800 ">Date Ascending</option>
        </select>

        <input
          type="text"
          name="organizer"
          placeholder="Filter by Organizer"
          value={filters.organizer}
          onChange={handleFilterChange}
          className="border rounded p-2 shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <select
          name="branch"
          value={filters.branch}
          onChange={handleFilterChange}
          className="border rounded p-2 shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="" className="text-blue-800">Filter by Department</option>
          {branches.map((branch) => (
            <option key={branch} value={branch} className="text-blue-800 hover:bg-blue-200">
              {branch}
            </option>
          ))}
        </select>

        {/* <select
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
          className="border rounded p-2 shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="" className="bg-blue-100 hover:bg-blue-200 border-b-[20px] border-b-white-800">Filter by Year</option>
          {years.map((year) => (
            <option key={year} value={year} className="bg-blue-100 hover:bg-blue-200 border-t-[2px] border-t-white-800">
              {year}
            </option>
          ))}
        </select> */}
        <select
  name="year"
  value={filters.year}
  onChange={handleFilterChange}
  className="border rounded p-2 shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
>
  <option value="" className="bg-blue-100 hover:bg-blue-200 text-blue-800">Filter by Year</option>
  {years.map((year, index) => (
    <option
      key={year}
      value={year} className="text-blue-800"
    >
      {year}
    </option>
  ))}
</select>

      </div> 

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div
            key={event._id}
            className="p-4 border rounded shadow-lg bg-blue-50 border-l-[10px] border-l-blue-800 transition-transform transform hover:scale-103 hover:shadow-2xl"
          >
            <h2 className="text-lg font-bold">{event.eventName}</h2>
            <p>{event.organizer}</p>
            <p>Date: {event.date}</p>
            <p>Time: {event.slot}</p>
            <p>Branch: {event.restrictions.department}</p>
            <p>Year: {event.restrictions.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllEvents;









// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import 'tailwindcss/tailwind.css';
// import { FaImage, FaVideo } from 'react-icons/fa';

// const sampleEvents = [
//   {
//     _id: '1',
//     name: 'Tech Meetup',
//     description: 'A meetup to discuss latest tech trends.',
//     organizerId: 'John Doe',
//     date: '2024-12-25',
//     time: '10:00 AM',
//     slot: 'slot1',
//     restrictions: {
//       department: ['CSE', 'ECE'],
//       year: ['E3', 'E4'],
//     },
//     registeredUsers: [],
//     status: 'approved',
//     image: 'https://via.placeholder.com/150',
//     assets: [
//       { type: 'image', url: 'https://via.placeholder.com/150', description: 'Tech Meetup Image 1' },
//       { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4', description: 'Tech Meetup Video' },
//     ],
//   },
//   {
//     _id: '2',
//     name: 'Robotics Workshop',
//     description: 'Learn how to build robots.',
//     organizerId: 'Jane Smith',
//     date: '2024-12-20',
//     time: '2:00 PM',
//     slot: 'slot2',
//     restrictions: {
//       department: ['Mechanical'],
//       year: ['E2', 'E3'],
//     },
//     registeredUsers: [],
//     status: 'pending',
//     image: 'https://via.placeholder.com/150',
//     assets: [],
//   },
//   {
//     _id: '3',
//     name: 'AI Conference',
//     description: 'Exploring AI innovations.',
//     organizerId: 'Tech Team',
//     date: '2024-12-15',
//     time: '11:00 AM',
//     slot: 'slot3',
//     restrictions: {
//       department: ['CSE'],
//       year: ['E1', 'E2'],
//     },
//     registeredUsers: [],
//     status: 'rejected',
//     image: 'https://via.placeholder.com/150',
//     assets: [],
//   },
//   {
//     _id: '4',
//     name: 'Blockchain Seminar',
//     description: 'Understanding blockchain technology.',
//     organizerId: 'Alice Brown',
//     date: '2024-12-30',
//     time: '3:00 PM',
//     slot: 'slot1',
//     restrictions: {
//       department: ['CSE', 'ECE'],
//       year: ['E1', 'E2', 'E3'],
//     },
//     registeredUsers: [],
//     status: 'approved',
//     image: 'https://via.placeholder.com/200',
//     assets: [
//       { type: 'image', url: 'https://via.placeholder.com/150', description: 'Blockchain Seminar Image 1' },
//     ],
//   },
//   {
//     _id: '5',
//     name: 'Cybersecurity Workshop',
//     description: 'Hands-on training for cybersecurity. Exciting event.',
//     organizerId: 'Cyber Team',
//     date: '2024-12-10',
//     time: '1:00 PM',
//     slot: 'slot2',
//     restrictions: {
//       department: ['CSE', 'Mechanical'],
//       year: ['E2', 'E3', 'E4'],
//     },
//     registeredUsers: [],
//     status: 'approved',
//     image: 'https://via.placeholder.com/200',
//     assets: [
//       { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4', description: 'Cybersecurity Workshop Video' },
//     ],
//   },
//   {
//     _id: '6',
//     name: 'Cloud Computing Seminar',
//     description: 'Learn about cloud computing technologies.',
//     organizerId: 'Cloud Team',
//     date: '2024-12-12',
//     time: '9:00 AM',
//     slot: 'slot1',
//     restrictions: {
//       department: ['CSE', 'IT'],
//       year: ['E1', 'E2', 'E3'],
//     },
//     registeredUsers: [],
//     status: 'approved',
//     image: 'https://via.placeholder.com/150',
//     assets: [
//       { type: 'image', url: 'https://via.placeholder.com/150', description: 'Cloud Computing Seminar Image 1' },
//     ],
//   },
//   {
//     _id: '7',
//     name: 'Game Development Workshop',
//     description: 'Learn the basics of game development.',
//     organizerId: 'Game Dev Team',
//     date: '2024-12-18',
//     time: '4:00 PM',
//     slot: 'slot2',
//     restrictions: {
//       department: ['CSE'],
//       year: ['E3', 'E4'],
//     },
//     registeredUsers: [],
//     status: 'approved',
//     image: 'https://via.placeholder.com/150',
//     assets: [
//       { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4', description: 'Game Development Workshop Video' },
//     ],
//   },
// ];

// const EventCard = ({ event, isAdmin }) => {
//   const currentDate = new Date();
//   const eventDate = new Date(event.date);

//   const isCompleted = eventDate < currentDate;
//   const showFeedbackButton = event.status === 'approved' && isCompleted;
//   const showRegisterButton = event.status === 'approved' && !isCompleted && !isAdmin;

//   const statusLabel = {
//     approved: 'Approved',
//     pending: 'Pending',
//     rejected: 'Rejected',
//   };

//   const statusColor = {
//     approved: 'bg-green-600 text-white',
//     pending: 'bg-yellow-500 text-white',
//     rejected: 'bg-red-600 text-white',
//   };

//   const [showAssets, setShowAssets] = useState(false);
//   const [currentAsset, setCurrentAsset] = useState(null);

//   const handleAssetClick = (asset) => {
//     setCurrentAsset(asset);
//     setShowAssets(true);
//   };

//   const handleCloseAsset = () => {
//     setShowAssets(false);
//     setCurrentAsset(null);
//   };

//   return (
//     <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 w-full sm:w-80">
//       <div className="relative overflow-hidden rounded-t-xl">
//         <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
//         {event.status && (
//           <div
//             className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded ${statusColor[event.status]}`}
//           >
//             {statusLabel[event.status]}
//           </div>
//         )}
//       </div>
//       <div className="p-6">
//         <h3 className="text-xl font-bold text-blue-600 mb-2">{event.name}</h3>
//         <p className="text-gray-700 mb-4">{event.description}</p>
//         <p className="text-sm text-gray-500 mb-1"><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
//         <p className="text-sm text-gray-500 mb-1"><strong>Time:</strong> {event.time}</p>
//         <p className="text-sm text-gray-500"><strong>Organizer:</strong> {event.organizerId}</p>
//       </div>
//       <div className="flex justify-between p-4 border-t border-blue-200">
//         {showRegisterButton && (
//           <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition">
//             Register
//           </button>
//         )}
//         {showFeedbackButton && (
//           <button className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition">
//             Feedback
//           </button>
//         )}
//         {(event.status === 'approved' || event.status === 'rejected') && (
//           <div className="flex space-x-4">
//             {event.assets.map((asset, index) => (
//               <div key={index} onClick={() => handleAssetClick(asset)}>
//                 {asset.type === 'image' && (
//                   <FaImage className="text-blue-600 cursor-pointer" title={asset.description} />
//                 )}
//                 {asset.type === 'video' && (
//                   <FaVideo className="text-blue-600 cursor-pointer" title={asset.description} />
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Display clicked asset */}
//       {showAssets && currentAsset && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-96">
//             <button onClick={handleCloseAsset} className="text-red-600 absolute top-2 right-2">X</button>
//             {currentAsset.type === 'image' ? (
//               <img src={currentAsset.url} alt={currentAsset.description} className="w-full h-auto" />
//             ) : (
//               <video controls className="w-full h-auto">
//                 <source src={currentAsset.url} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             )}
//             <p className="mt-4 text-center">{currentAsset.description}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const Events = () => {
//   const user = useSelector((state) => state.auth.user);

//   if (!user) {
//     return <div className="text-center mt-10">User is not logged in.</div>;
//   }

//   return (
//     <div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 bg-gray-50">
//         {sampleEvents
//           .filter((event) =>
//             user.role === 'admin' ? true : event.status !== 'pending' && event.status !== 'rejected'
//           )
//           .map((event) => (
//             <EventCard key={event._id} event={event} isAdmin={user.role === 'admin'} />
//           ))}
//       </div>
//     </div>
//   );
// };

// export default Events;


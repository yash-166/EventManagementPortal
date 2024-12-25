// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import 'tailwindcss/tailwind.css';
// import { FaImage, FaVideo } from 'react-icons/fa';
// import { useEffect } from 'react';

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
//         <img src="Event.jpeg" alt={event.name} className="w-full h-48 object-cover" />
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

//   const [sampleEvents,setSampleEvents] = useState([]);



//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         // Retrieve JWT token (assuming it's stored in localStorage)
//         const token = localStorage.getItem("Token");

//         if (!token) {
//           throw new Error("No token found. Please log in.");
//         }

//         const response = await fetch("http://localhost:3000/api/events/getallevents", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Add the JWT token to the Authorization header
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         setSampleEvents(data.allEvents); // Assuming the response contains an array of events
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchEvents();
//   }, []);

  
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


import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import 'tailwindcss/tailwind.css';
import { FaImage, FaVideo } from 'react-icons/fa';

const EventCard = ({ event, isAdmin }) => {
  const currentDate = new Date();
  const eventDate = new Date(event.date);
  
  const isCompleted = eventDate < currentDate;
  const showFeedbackButton = event.status === 'approved' && isCompleted;
  const showRegisterButton = event.status === 'approved' && !isCompleted && !isAdmin;
  
  const statusLabel = {
    approved: 'Approved',
    pending: 'Pending',
    rejected: 'Rejected',
  };
  
  const statusColor = {
    approved: 'bg-green-600 text-white',
    pending: 'bg-yellow-500 text-white',
    rejected: 'bg-red-600 text-white',
  };

  const [showAssets, setShowAssets] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  const handleAssetClick = (asset) => {
    setCurrentAsset(asset);
    setShowAssets(true);
  };

  const handleCloseAsset = () => {
    setShowAssets(false);
    setCurrentAsset(null);
  };

  const handleSubmitFeedback = async () => {
    const token = localStorage.getItem('Token');

    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/events/addfeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event._id,
          feedback,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Feedback submitted successfully:', result);

      // Close modal and reset feedback
      setShowFeedbackModal(false);
      setFeedback('');
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };
  const sendConfirmmail = async (id) => {
    try {
      const token = localStorage.getItem("Token");
        const response = await fetch('http://localhost:3000/send-confirm-mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
             }, 
             body:JSON.stringify({
              EventId:id,
             })// Send email as payload
        });

        const result = await response.json();

        if (response.ok) {
            alert('Confirmation email sent successfully!');
          
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error sending confirmation mail:', error);
        alert('Failed to send confirmation email.');
    }
};
  return (
    <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 w-full sm:w-80">
      <div className="relative overflow-hidden rounded-t-xl">
        <img src="Event.jpeg" alt={event.name} className="w-full h-48 object-cover" />
        {event.status && (
          <div
            className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded ${statusColor[event.status]}`}
          >
            {statusLabel[event.status]}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-blue-600 mb-2">{event.name}</h3>
        <p className="text-gray-700 mb-4">{event.description}</p>
        <p className="text-sm text-gray-500 mb-1"><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
        <p className="text-sm text-gray-500 mb-1"><strong>Time:</strong> {event.time}</p>
        <p className="text-sm text-gray-500"><strong>Organizer:</strong> {event.organizerId}</p>
      </div>
      <div className="flex justify-between p-4 border-t border-blue-200">
        {showRegisterButton && (
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition" onClick={() =>sendConfirmmail(event._id)}>
          {/* {
              localStorage.getItem("register") === "true" ? "Registered" : "Register"
            } */}
            Register  
          </button>
          
        )}
        {showFeedbackButton && (
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
          >
            Feedback <button>Like</button>
          </button>
        )}
        {(event.status === 'approved' || event.status === 'rejected') && (
          <div className="flex space-x-4">
            {event.assets.map((asset, index) => (
              <div key={index} onClick={() => handleAssetClick(asset)}>
                {asset.type === 'image' && (
                  <FaImage className="text-blue-600 cursor-pointer" title={asset.description} />
                )}
                {asset.type === 'video' && (
                  <FaVideo className="text-blue-600 cursor-pointer" title={asset.description} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Display clicked asset */}
      {showAssets && currentAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <button onClick={handleCloseAsset} className="text-red-600 absolute top-2 right-2">X</button>
            {currentAsset.type === 'image' ? (
              <img src={currentAsset.url} alt={currentAsset.description} className="w-full h-auto" />
            ) : (
              <video controls className="w-full h-auto">
                <source src={currentAsset.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <p className="mt-4 text-center">{currentAsset.description}</p>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <button onClick={() => setShowFeedbackModal(false)} className="text-red-600 absolute top-2 right-2">X</button>
            <h3 className="text-xl font-bold text-center mb-4">Leave Your Feedback</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Write your feedback here..."
            ></textarea>
            <button
              onClick={handleSubmitFeedback}
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition w-full"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Events = () => {
  const [sampleEvents, setSampleEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Retrieve JWT token (assuming it's stored in localStorage)
        const token = localStorage.getItem('Token');

        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await fetch('http://localhost:3000/api/events/getallevents', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Add the JWT token to the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setSampleEvents(data.allEvents); // Assuming the response contains an array of events
      } catch (err) {
        console.log(err);
      }
    };

    fetchEvents();
  }, []);

  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <div className="text-center mt-10">User is not logged in.</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 bg-gray-50">
        {sampleEvents
          .filter((event) =>
            user.role === 'admin' ? true : event.status !== 'pending' && event.status !== 'rejected'
          )
          .map((event) => (
            <EventCard key={event._id} event={event} isAdmin={user.role === 'admin'} />
          ))}
      </div>
    </div>
  );
};

export default Events;

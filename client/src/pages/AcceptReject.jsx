import { useSelector } from "react-redux";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";




const RequestItem = ({ organizer, eventName, date, time, _id, showRejectionModal, selectedRequestStatus ,showAcceptModal}) => {
  // Only show the icons if the status is neither 'accepted' nor 'rejected'
  console.log(selectedRequestStatus)
  const showIcons = selectedRequestStatus !== "approved" && selectedRequestStatus !== "rejected";
  console.log(showIcons)
  return (
    <div className="p-4 border rounded-lg flex items-center justify-between bg-blue-50 shadow-lg border-l-[10px] border-l-blue-800 hover:scale-1">
      <div>
        <p className="font-medium text-blue-600">Event Organizer: {organizer}</p>
        <p>Event Name: {eventName}</p>
        <p>Date: {date}</p>
        <p>Time: {time}</p>
      </div>
      {/* Conditionally render the action buttons */}
      {showIcons && (
        <div className="flex items-center space-x-2">
          <button className="text-green-600 hover:text-green-800"
          onClick={()=>showAcceptModal(organizer, eventName, date, time, _id)}>
            <i className="fas fa-check"></i>
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => showRejectionModal(organizer, eventName, date, time, _id)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
    </div>
  );
};

const RejectionModal = ({ isOpen, eventDetails, closeRejectionModal, submitRejection }) => (
  isOpen && (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-4">Reject Event</h3>
        {/* Use eventDetails here */}
        <p>{eventDetails.eventDetails}</p>
        <textarea id="rejectionReason" className="w-full border p-2 mt-2" placeholder="Enter reason for rejection"></textarea>
        <div className="flex items-center justify-end space-x-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={closeRejectionModal}>Cancel</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => submitRejection(eventDetails)}>Submit</button>
        </div>
      </div>
    </div>
  )
);
const AcceptanceModal = ({ isOpen, eventDetails, closeAcceptanceModal, handleAcceptEvent }) => (
  isOpen && (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-4">Reject Event</h3>
        {/* Use eventDetails here */}
        <p>Do you want to confirm it?</p>
        {/* <textarea id="rejectionReason" className="w-full border p-2 mt-2" placeholder="Enter reason for rejection"></textarea> */}
        <div className="flex items-center justify-end space-x-2 mt-4 p-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={closeAcceptanceModal}>Cancel</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => handleAcceptEvent(eventDetails)}>Renerate Report</button>
        </div>
      </div>
    </div>
  )
);
  

const AcceptReject = () => {
const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalEventDetails, setModalEventDetails] = useState('');
const [selectedRequestStatus, setSelectedRequestStatus] = useState('pending');
const [requests, setRequests] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
const [isApproved, setIsApproved] = useState(false);
const toggleSettingsMenu = () => setIsSettingsMenuOpen(!isSettingsMenuOpen);
const [showModal, setShowModal] = useState(false);
const handleStatusChange = (e) => {
  setSelectedRequestStatus(e.target.value);
};
const showRejectionModal = (organizer, eventName, date, time, _id) => {
  const eventDetails = `Organizer: ${organizer}, Event: ${eventName}, Date: ${date}, Time: ${time},_id:${_id}`;
  console.log(eventDetails);
  setModalEventDetails({
    eventDetails: eventDetails,  // This will be the string
    _id:_id                    // This will be used for submitting rejection
  });
  setIsModalOpen(true);
};

const showAcceptModal = (organizer, eventName, date, time, _id) => {
  const eventDetails = `Organizer: ${organizer}, Event: ${eventName}, Date: ${date}, Time: ${time},_id:${_id}`;
  console.log(eventDetails);
  setModalEventDetails({
    eventDetails: eventDetails,  // This will be the string
    _id:_id                    // This will be used for submitting rejection
  });
  setShowModal(true);
};

const closeRejectionModal = () => setIsModalOpen(false);
const closeAcceptanceModal=()=>showModal(false);
const submitRejection = async (eventDetails) => {
  const reason = document.getElementById("rejectionReason").value;

  try {
    const response = await fetch(`http://localhost:3000/rejectRequest/${modalEventDetails._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventDetails: eventDetails, // Send the event details
        reason: reason,             // Send the rejection reason
      }),
    });

    if (!response.ok) {
      alert("Failed to submit rejection");
      alert(`${modalEventDetails._id}`)
      throw new Error("Failed to submit rejection");
    }
    const updatedRequest = await response.json();
    console.log("Updated Request:", updatedRequest);
    closeRejectionModal();
  } catch (error) {
    console.error("Error submitting rejection:", error);
  }
};
const handleAcceptEvent = async (eventDetails) => {
  setShowModal(false)
  try {
    const response = await fetch(`http://localhost:3000/acceptrequest/${modalEventDetails._id}`, {  // Backend URL for accepting events
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( eventDetails),
    });
    if (!response.ok) {
      throw new Error('Error accepting event');
    }
    setIsApproved(true);
    setShowModal(false);
    fetchRequests();
    //fetchAcceptedEvents(); // Re-fetch the accepted events after adding this one
  } catch (error) {
    console.error('Error:', error);
  }
    

    fetch('http://localhost:3000/generate-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventDetails)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Report generated and sent to organizer');
      } else {
        alert('Failed to generate report');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred');
    });
  };

 



useEffect(() => {
  const fetchRequests = async () => {
    try {
      const response = await fetch("http://localhost:3000/getRequests"); // Replace with your backend URL
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setRequests(data); 
      data.forEach(request => {
          console.log(request._id);  // This will log the _id of each request
        });
      console.log("Data received:", JSON.stringify(data, null, 2));
   //   fetchRequests()
// Assuming the backend returns an array of requests
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchRequests();
}, []);

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
const handleEventRequestsClick = () => {
  // Set the state to 'pending' when the h3 element is clicked
  setSelectedRequestStatus('pending');
  fetchRequests()
};
const fetchRequests = async () => {
  try {
    const response = await fetch("http://localhost:3000/getRequests"); // Replace with your backend URL
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    setRequests(data); 
    data.forEach(request => {
        console.log(request._id);  // This will log the _id of each request
      });
    console.log("Data received:", JSON.stringify(data, null, 2));
// Assuming the backend returns an array of requests
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
}
useEffect(() => {
  // Function to fetch rejected requests
  const fetchRejectedRequests = async () => {
    if (selectedRequestStatus === "rejected") {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/getRejectedRequests");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setRequests(data); // Set the fetched requests
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Call the fetch function when selectedRequestStatus changes
  fetchRejectedRequests();
}, [selectedRequestStatus]); 
useEffect(() => {
  // Function to fetch rejected requests
  const fetchRejectedRequests = async () => {
    if (selectedRequestStatus === "approved") {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/getAcceptedRequests");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setRequests(data); // Set the fetched requests
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Call the fetch function when selectedRequestStatus changes
  fetchRejectedRequests();
}, [selectedRequestStatus]); 
return (
   <div className="flex h-screen">
  {/* //   <Sidebar /> */}
    <div className="flex-1 flex flex-col">
  {/* //     <Navbar toggleSettingsMenu={toggleSettingsMenu} /> */}
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-600" onClick={handleEventRequestsClick}>Event Requests</h3>
          <div className="flex space-x-4">
            <label className="flex items-center text-lg font-semibold text-blue-600">
              <input
                type="radio"
                name="requestStatus"
                value="approved"
                checked={selectedRequestStatus === 'approved'}
                onChange={handleStatusChange}
                className="mr-2"
              />
              Accepted Requests
            </label>
            <label className="flex items-center text-lg font-semibold text-red-800">
              <input
                type="radio"
                name="requestStatus"
                value="rejected"
                checked={selectedRequestStatus === 'rejected'}
                onChange={handleStatusChange}
                className="mr-2"
              />
              Rejected Requests
            </label>
          </div>
        </div>

        <div className="space-y-4">
          {requests
            .filter((request) => request.status === selectedRequestStatus)
            .map((request, index) => (
           
              <RequestItem
key={index}
organizer={request.organizer}
eventName={request.name}
date={request.date}
time={request.slot}
_id={request._id} // Add the ID here
showRejectionModal={showRejectionModal}
selectedRequestStatus={selectedRequestStatus}
showAcceptModal={showAcceptModal}
/>

            ))}
        </div>
      </main>
    </div>
     <RejectionModal
      isOpen={isModalOpen}
      eventDetails={modalEventDetails}
      closeRejectionModal={closeRejectionModal}
      submitRejection={submitRejection}
    />
     <AcceptanceModal
      isOpen={showModal}
      eventDetails={modalEventDetails}
      closeAcceptanceModal={closeAcceptanceModal}
      handleAcceptEvent={handleAcceptEvent}
    />
  
  </div> 
);
};



export default AcceptReject;

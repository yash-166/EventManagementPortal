import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import axios from "axios";
// import Carousel from "./carousel";

const url = "http://localhost:8080/uploads";
const sampleEvents = [
  {
    _id: "4",
    name: "Blockchain Seminar",
    description: "Understanding blockchain technology.",
    organizerId: "Alice Brown",
    date: "2024-12-30",
    time: "3:00 PM",
    slot: "slot1",
    restrictions: {
      department: ["CSE", "ECE"],
      year: ["E1", "E2", "E3"],
    },
    registeredUsers: [],
    status: "approved",
    image: "https://via.placeholder.com/200",
    assets: [
      {
        type: "image",
        url: "https://via.placeholder.com/150",
        description: "Blockchain Seminar Image 1",
      },
    ],
  },
  {
    _id: "4",
    name: "Blockchain Seminar",
    description: "Understanding blockchain technology.",
    organizerId: "Alice Brown",
    date: "2024-12-30",
    time: "3:00 PM",
    slot: "slot1",
    restrictions: {
      department: ["CSE", "ECE"],
      year: ["E1", "E2", "E3"],
    },
    registeredUsers: [],
    status: "approved",
    image: "https://via.placeholder.com/200",
    assets: [
      {
        type: "image",
        url: "https://via.placeholder.com/150",
        description: "Blockchain Seminar Image 1",
      },
    ],
  },
  {
    _id: "5",
    name: "Cybersecurity Workshop",
    description: "Hands-on training for cybersecurity. Exciting event.",
    organizerId: "Cyber Team",
    date: "2024-12-10",
    time: "1:00 PM",
    slot: "slot2",
    restrictions: {
      department: ["CSE", "Mechanical"],
      year: ["E2", "E3", "E4"],
    },
    registeredUsers: [],
    status: "approved",
    image: "https://via.placeholder.com/200",
    assets: [
      {
        type: "video",
        url: "https://www.w3schools.com/html/movie.mp4",
        description: "Cybersecurity Workshop Video",
      },
    ],
  },
  // Additional events omitted for brevity
];

const user = { role: "organizer" };

const EventCard = ({ event, isAdmin }) => {
  const currentDate = new Date();
  const eventDate = new Date(event.date);
  const [showForm, setShowForm] = useState(false);
  const isCompleted = eventDate < currentDate;
  const showAddMemoriesButton = event.status === "approved" && isCompleted;
  const showViewMemoriesButton = event.status === "approved" && isCompleted;
  const showRegisterButton =
    event.status === "approved" && !isCompleted && !isAdmin;
  const [files, setFiles] = useState([]);
  const [carouselVisible, setCarouselVisible] = useState(false);

  const statusLabel = {
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
  };

  const statusColor = {
    approved: "bg-green-600 text-white",
    pending: "bg-yellow-500 text-white",
    rejected: "bg-red-600 text-white",
  };

  const [showAssets, setShowAssets] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [isFileModalOpen, setIsFileModalOpen] = useState(true);

  const handleAssetClick = (asset) => {
    setCurrentAsset(asset);
    setShowAssets(true);
  };

  const handleCloseAsset = () => {
    setShowAssets(false);
    setCurrentAsset(null);
  };

  const org_id = 1;
  const eventName = "workshop";

  const handleFileUploads = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("org_id", org_id);
    formData.append("eventName", eventName);
    try {
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const showGallery = async () => {
    alert("in gallery");
    const eventName = "workshop";
    try {
      const response = await axios.get("http://localhost:8080/gallery", {
        params: {
          eventName,
          org_id,
        },
      });
      console.log("Image URLs:", response.data.images);

      const images = response.data.images;
      if (images.length > 0) {
        setFiles(images);
        setCarouselVisible(true);
        sendtoCarousel();
      } else {
        return <p>No images found for this event.</p>;
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      return <p>Failed to load images.</p>;
    }
  };

  const handleSubmit = () => {
    // Hide modal when submit is clicked
    setIsFileModalOpen(false);
    console.log("Submit clicked");
  };

  const sendtoCarousel = () => {
    console.log("sending to carousel");
    return (
    //   <div className="z-10">
    //     <Carousel files={files} />
    //   </div>
    ""
    );
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 sm:max-w-80">
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-48 object-cover"
        />
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
        <p className="text-sm text-gray-500 mb-1">
          <strong>Date:</strong> {new Date(event.date).toDateString()}
        </p>
        <p className="text-sm text-gray-500 mb-1">
          <strong>Time:</strong> {event.time}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Organizer:</strong> {event.organizerId}
        </p>
      </div>
      <div className="flex justify-between p-4 border-t border-blue-200">
        {showRegisterButton && (
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition">
            Register
          </button>
        )}
        {showAddMemoriesButton && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white py-1 px-4 rounded-lg hover:bg-green-700 transition"
          >
            Add Memories
          </button>
        )}
        {showViewMemoriesButton && (
          <button
            className="bg-green-600 text-white py-1 px-4 rounded-lg hover:bg-green-700 transition"
            onClick={() => showGallery()}
          >
            View Memories
          </button>
        )}
        {carouselVisible && sendtoCarousel()}
        {(event.status === "approved" || event.status === "rejected") && (
          <div className="flex space-x-4">
            {event.assets.map((asset, index) => (
              <div key={index} onClick={() => handleAssetClick(asset)}>
                {/* Asset preview logic */}
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full sm:w-96">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">
              Upload Memories
            </h3>
            {isFileModalOpen && (
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="file-upload"
                    className="block text-lg font-semibold text-gray-700"
                  >
                    Choose a file (Image/Video)
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    accept=".jpeg, .png, .jpg, .mp4, .mov, .avi"
                    onChange={handleFileUploads}
                    className="mt-2 w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded file:bg-blue-50 hover:file:bg-blue-100"
                  />
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    className="bg-green-600 text-white py-2 px-8 rounded-lg hover:bg-green-700 transition duration-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {showAssets && currentAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full sm:w-96">
            <button
              onClick={handleCloseAsset}
              className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>

            <h3 className="text-center text-xl font-semibold mb-4 text-gray-800">
              Asset Preview
            </h3>
            <div className="relative">
              {currentAsset.type === "image" ? (
                <img
                  src={currentAsset.url}
                  alt={currentAsset.description}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              ) : currentAsset.type === "video" ? (
                <video
                  controls
                  src={currentAsset.url}
                  className="w-full h-auto rounded-lg shadow-lg"
                ></video>
              ) : (
                <p>No preview available for this asset.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EventCards = () => {
  return (
    <div className="space-y-6 flex flex-col md:flex-row md:space-x-6 justify-around">
  {sampleEvents.map((event, index) => (
    <EventCard key={index} event={event} isAdmin={user.role === "organizer"} />
  ))}
</div>

  );
};

export default EventCards;

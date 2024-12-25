// // import React from 'react'
// // import { useSelector } from "react-redux";
// // import { useNavigate } from "react-router-dom";
// // import { useEffect } from "react";



// // const BookEvents = () => {
// //   const user = useSelector((state) => state.auth.user);
// // console.log("Accept-reject:", user);

// // const navigate = useNavigate();

// // useEffect(() => {
// //   if (user?.role !== "organizer") { // Corrected condition
// //     if(user?.role == "student")
// //     {
// //       navigate("/organization");
// //     }
// //     else{
// //       navigate("/");
// //     }

// //   }
// // }, [user, navigate]);
// //   return (
// //     <div>BookEvents</div>
// //   )
// // }

// // export default BookEvents
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";



// const events = [
//   {
//     name: "Event 1",
//     description: "Description 1",
//     organizerId: "123",
//     date: "2024-12-23",
//     slot: "slot1",
//   },
//   {
//     name: "Event 2",
//     description: "Description 2",
//     organizerId: "124",
//     date: "2024-12-23",
//     slot: "slot2",
//   },
//   {
//     name: "Event 3",
//     description: "Description 3",
//     organizerId: "125",
//     date: "2024-12-25",
//     slot: "slot1",
//   },
//   {
//     name: "Event 4",
//     description: "Description 4",
//     organizerId: "126",
//     date: "2024-12-23",
//     slot: "slot3",
//   },
//   {
//     name: "Event 5",
//     description: "Description 5",
//     organizerId: "127",
//     date: "2024-12-25",
//     slot: "slot3",
//   },
//   {
//     name: "Event 6",
//     description: "Description 6",
//     organizerId: "128",
//     date: "2024-12-27",
//     slot: "slot3",
//   },
//   {
//     name: "Event 6",
//     description: "Description 6",
//     organizerId: "128",
//     date: "2024-12-30",
//     slot: "slot3",
//   }
// ];

const CreateEvent = () => {

  const [events,setEvents] = useState([])

  
        useEffect(() => {
          const fetchEvents = async () => {
            try {
              const token = localStorage.getItem("Token"); // Retrieve the JWT token from localStorage
      
              if (!token) {
                console.error("No token found in localStorage");
                return;
              }
      
              // Send the GET request with the token in the headers
              const response = await fetch("http://localhost:3000/api/events/getevent", {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                  "Content-Type": "application/json", // Optional, depending on your backend requirements
                },
              });
      
              if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
              }
      
              const data = await response.json();
              console.log("Events from booking fetched successfully:", data);
              setEvents(data.allEvents);
            } catch (error) {
              console.error("Error fetching events:", error.message);
            }
          };
      
          fetchEvents();
        }, []);


  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return {
      firstDay: new Date(year, month, 1).getDay(),
      daysInMonth: new Date(year, month + 1, 0).getDate(),
    };
  };

  const handleMonthChange = (offset) => {
    setCurrentDate(
      new Date(currentDate.setMonth(currentDate.getMonth() + offset))
    );
  };



  const handleDateClick = (date) => {
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    // Check if all slots are booked for the selected date
    const bookedSlots = events.filter((event) => event.date === formattedDate).length;

    if (date > new Date() && bookedSlots < 3) {
      setSelectedDate(date);
      setIsModalOpen(true);
    }
  };

  const handleFormSubmit = async (data) => {
    const filteredDepartments = data.department.filter((dept) => dept !== "all");
  
    const filteredYears = data.year
      .filter((year) => year !== "all")
      .map((year) => `E${year}`);

      // const formattedDate = selectedDate.split("T")[0];
      // const formattedDate = (selectedDate+1).toISOString().split("T")[0];


          const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    const formattedDate = newDate.toISOString().split("T")[0];


      // console.log(formattedDate);

  
    let filteredData = {
      ...data,
      department: filteredDepartments,
      year: filteredYears,
      date:formattedDate,
    };
  
    console.log("Form data:", filteredData);
  
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("Token");
  
      const response = await fetch("http://localhost:3000/api/events/insertevent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
        body: JSON.stringify(filteredData),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Error sending data to the backend:", error);
    }

    navigate("/book-event")
  
    reset();
    handleModalClose();
  };
  



  const renderDays = () => {
    const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date(); // Get today's date
    const days = [];

    // Function to determine color based on booked slots
    const getSlotColor = (date) => {
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      const bookedSlots = events.filter((event) => event.date === formattedDate).length;

      if (bookedSlots === 1) return "bg-green-200"; // 1 slot booked
      if (bookedSlots === 2) return "bg-yellow-200"; // 2 slots booked
      if (bookedSlots === 3) return "bg-red-400"; // All 3 slots booked
      return "bg-white"; // No slots booked
    };

    // Empty cells before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-16 md:h-20 border bg-gray-100"></div>
      );
    }

    // Actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const cellDate = new Date(year, month, i);
      const formattedDate = `${cellDate.getFullYear()}-${String(
        cellDate.getMonth() + 1
      ).padStart(2, "0")}-${String(cellDate.getDate()).padStart(2, "0")}`;

      console.log("formatted date :",formattedDate);
      console.log("event data:",events[1]);
      const bookedSlots = events.filter((event) => event.date == formattedDate).length;
      console.log("Bookedslots",bookedSlots);
      const isPastDate = cellDate < today;
      const isToday = cellDate.toDateString() === today.toDateString();

      // Determine color based on booked slots
      const slotColor = getSlotColor(cellDate);

      // Set the cursor style based on conditions
      const cursorStyle =
        isPastDate || bookedSlots === 3 ? "cursor-not-allowed" : "cursor-pointer";

      // Tooltip for fully booked dates
      const tooltipText = bookedSlots === 3 ? "All slots booked" : "";

      days.push(
        <div
          key={`day-${i}`}
          className={`h-16 md:h-20 border ${slotColor} ${isToday ? "shadow-md border-blue-500 shadow-blue-500" : ""
            } flex items-center justify-center hover:bg-blue-200 ${cursorStyle}`}
          onClick={() =>
            !isPastDate && bookedSlots < 3 && handleDateClick(cellDate)
          }
          style={
            isToday
              ? {
                boxShadow: "0px 4px 10px 2px rgba(59, 130, 246, 0.8)",
                borderRadius: "8px",
              }
              : {}
          }
          title={tooltipText} // Tooltip for hover
        >
          <span
            className={`text-gray-800 font-medium ${isToday ? "font-bold" : ""}`}
          >
            {i}
          </span>
        </div>
      );
    }

    // Empty cells after the last day of the month
    const totalCells = firstDay + daysInMonth;
    const remainingCells = 42 - totalCells;
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <div
          key={`empty-last-${i}`}
          className="h-16 md:h-20 border bg-gray-100"
        ></div>
      );
    }

    return days;
  };




  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };





  const availableSlots = (() => {
    if (!selectedDate) return [];

    // Format the selected date to YYYY-MM-DD in local time
    const formattedDate = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

    const occupiedSlots = events
      .filter((event) => event.date === formattedDate)
      .map((event) => event.slot);

    const allSlots = ["slot1", "slot2", "slot3"];
    return allSlots.filter((slot) => !occupiedSlots.includes(slot));
  })();


  return (

    <>
      <div className=" p-4 rounded-md mb-6">
        {/* <h2 className="text-lg font-semibold mb-2 text-center">Legend</h2> */}
        <div className="flex flex justify-between gap-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">1 slot booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm">2 slots booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm">3 slots booked</span>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-semibold mb-4">Select date to book the event</h1>
      </div>
      <div className="bg-blue-100 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => handleMonthChange(-1)}
              className="bg-blue-500 text-white md:px-4 md:py-2 px-[6px] py-[4px] rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200"
            >
              &#8592; Prev
            </button>
            <span
              id="monthYear"
              className="text-[13px] md:text-xl font-bold text-blue-700 md:ps-0"
            >
              {`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            </span>
            <button
              onClick={() => handleMonthChange(1)}
              className="bg-blue-500 text-white md:px-4 md:py-2 px-[6px] py-[4px] rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200"
            >
              Next &#8594;
            </button>
          </div>
          <div className="grid grid-cols-7 text-xs md:text-sm border border-blue-300 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-2 md:p-4 text-center font-bold bg-blue-200 text-blue-700"
              >
                {day}
              </div>
            ))}
          </div>
          <div
            id="calendarDays"
            className="grid grid-cols-7 gap-1 md:gap-2 border border-blue-300"
          >
            {renderDays()}
          </div>
        </div>


        <Modal
          isOpen={isModalOpen}
          appElement={document.getElementById("root")}
          onRequestClose={handleModalClose}
          className="bg-white p-6 rounded-lg shadow-2xl mx-auto max-w-lg w-full sm:mt-12 sm:mb-12 max-h-screen  overflow-y-auto mt-[70px]"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Booking for an Event</h2>
            <button
              onClick={handleModalClose}
              className="text-gray-700 hover:text-gray-900 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
          </div>



          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 md:w-90">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Enter name"
                className="w-full md:p-3 p-1 border rounded bg-gray-100 shadow-inner focus:ring-2 focus:ring-blue-400"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Description</label>
              <input
                {...register("description", { required: "Description is required" })}
                type="text"
                placeholder="Enter Description"
                className="w-full md:p-3 p-1 border rounded bg-gray-100 shadow-inner focus:ring-2 focus:ring-blue-400"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>



            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Date</label>
              <input
                type="text"
                value={selectedDate ? selectedDate.toDateString() : ""}
                readOnly
                className="w-full md:p-3 p-1 border rounded bg-gray-100 shadow-inner focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Available Slots</label>
              <select
                {...register("slot", { required: "Please select a slot" })}
                className="w-full md:p-3 p-1 border rounded bg-gray-100 shadow-inner focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select slot</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.slot && (
                <p className="text-red-500 text-xs mt-1">{errors.slot.message}</p>
              )}
            </div>





            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Allowed Departments</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("department")}
                    value="all"
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const departmentInputs = Array.from(document.querySelectorAll('input[name="department"]'));
                      departmentInputs.forEach((input) => {
                        if (input.value !== "all") input.checked = isChecked;
                      });
                    }}
                  />
                  <span className="ml-2">All</span>
                </label>
                {["CSE", "ECE", "EEE"].map((dept) => (
                  <label className="flex items-center" key={dept}>
                    <input
                      type="checkbox"
                      {...register("department")}
                      value={dept}
                    />
                    <span className="ml-2">{dept}</span>
                  </label>
                ))}
              </div>
              {errors.department && (
                <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>
              )}
            </div>






            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Allowed Batch Students</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("year")}
                    value="all"
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const yearInputs = Array.from(document.querySelectorAll('input[name="year"]'));
                      yearInputs.forEach((input) => {
                        if (input.value !== "all") input.checked = isChecked;
                      });
                    }}
                  />
                  <span className="ml-2">All</span>
                </label>
                {["1", "2", "3", "4"].map((year) => (
                  <label className="flex items-center" key={year}>
                    <input
                      type="checkbox"
                      {...register("year")}
                      value={year}
                    />
                    <span className="ml-2">{`${year} Year`}</span>
                  </label>
                ))}
              </div>
              {errors.year && (
                <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>
              )}
            </div>



            <button
              type="submit"
              className="w-full bg-blue-500 text-white md:p-3 p-2 rounded shadow-md hover:bg-blue-600 transition-all duration-200"
            >
              Submit
            </button>
          </form>

        </Modal>


      </div>
    </>
  );
};

export default CreateEvent;

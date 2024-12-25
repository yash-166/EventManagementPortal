import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice.js";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";



  
  const Calendar = () => {
    const dispatch = useDispatch();
    const [events,setEvents] = useState([]);
    const [dataCard,setDatacard] =useState([]);
      // const user = useSelector((state) => state.auth.user);
      // console.log("User:",user);

    

      const navigate = useNavigate();

      const user = { role: localStorage.getItem("user") };

      


      useEffect(() => {
        if (user.role == "student") {
          navigate("/organization"); 
        }
      }, [user, navigate]);




      // console.log(user.role);
      // if(user.role == "student")
      // {
      //   navigate("/organization");
      // }
      


      


      useEffect(() => {
        const fetchEvents = async () => {
          try {
            console.log(user.role);
            if (!user || !user.role) {
              console.error("User or role is not available");
              return;
            }
            const token = localStorage.getItem("Token"); // Retrieve the JWT token from localStorage
      
            if (!token) {
              console.error("No token found in localStorage");
              return;
            }
      
            // Decide the API endpoint based on the user's role
            const endpoint = 
              user.role === "admin"
                ? "http://localhost:3000/api/events/getallevents"
                : "http://localhost:3000/api/events/getevent";
      
            // Send the GET request with the token in the headers
            console.log(endpoint)
            const response = await fetch(endpoint, {
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
            console.log("Events fetched successfully:", data);


      
            // Handle data based on the user's role
            if (user.role === "admin") {
              setDatacard([
                data.totalEvents,
                data.approvedEventsCount,
                data.pendingEventsCount,
                data.rejectedEventsCount,
              ]);
              setEvents(data.allEvents); // Assuming `setEvents` should handle admin events
            } else if (user.role === "organizer") {
              setDatacard([
                data.totalOrganizationEvents,
                data.approvedOrganizationEvents,
                data.pendingOrganizationEvents,
                data.rejectedOrganizationEvents,
              ]);
              setEvents(data.organizationEvents); // Assuming `setEvents` should handle organizer-specific events
            }
          } catch (error) {
            console.error("Error fetching events:", error.message);
          }
        };
      
        fetchEvents();
      }, []); // Dependency array to ensure effect runs when `user.role` changes
      
 
    

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
    const [hoveredDate, setHoveredDate] = useState(null);
  
    const getDaysInMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      return { firstDay, daysInMonth };
    };
  
    const handlePrevMonth = () => {
      setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };
  
    const handleNextMonth = () => {
      setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };
  
    const getDayColor = (dayEvents) => {
      const bookedSlots = new Set(dayEvents.map((event) => event.slot));
      if (bookedSlots.size === 3) return "bg-red-300";
      if (bookedSlots.size === 1) return "bg-green-300";
      if (bookedSlots.size === 2) return "bg-yellow-300";
      return "bg-white";
    };
  
    const renderDays = () => {
      const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
  
      const days = [];
  
      // Empty cells for the first week
      for (let i = 0; i < firstDay; i++) {
        days.push(
          <div key={`empty-${i}`} className="h-16 md:h-20 border bg-gray-100"></div>
        );
      }
  
      // Actual days
      for (let i = 1; i <= daysInMonth; i++) {
        const cellDate = new Date(year, month, i);
        const dayEvents = events.filter(
          (event) => new Date(event.date).toDateString() === cellDate.toDateString()
        );
  
        const isHovered = hoveredDate && hoveredDate.toDateString() === cellDate.toDateString();
  
        days.push(
          <div
            key={`day-${i}`}
            className={`h-16 md:h-20 border ${getDayColor(dayEvents)} hover:bg-blue-200 flex items-center justify-center relative`}
            onMouseEnter={() => dayEvents.length && setHoveredDate(cellDate)}
            onMouseLeave={() => setHoveredDate(null)}
          >
            <span className="text-gray-800 font-medium">{i}</span>
  
            {isHovered && dayEvents.length > 0 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 space-y-2">
                {dayEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg ${
                      index % 2 === 0 ? "translate-x-[20px]" : "-translate-x-[20px]"
                    }`}
                  >
                    {event.slot}: {event.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
  
      // Empty cells to fill the last row
      const totalCells = firstDay + daysInMonth;
      const remainingCells = 42 - totalCells;
      for (let i = 0; i < remainingCells; i++) {
        days.push(
          <div key={`empty-last-${i}`} className="h-16 md:h-20 border bg-gray-100"></div>
        );
      }
  
      return days;
    };
    console.log("Data card:",dataCard);
  
    return (
   
      <div className="  w-full min-h-screen flex justify-center mt-2">
        <div className="w-full max-w-8xl bg-white shadow-lg rounded-lg p-4 sm:p-6">
          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {dataCard.map((card,index) => (
              <div
                key={card}
                className={`border border-blue-300 rounded-lg p-4 shadow-md transition-transform duration-200 transform hover:scale-105 hover:shadow-lg ${
                  index === 0
                    ? "bg-blue-500"
                    : index === 1
                    ? "bg-green-500"
                    : index === 2
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                <h3 className="text-white font-bold text-lg">{card} Events</h3>
                <p className="text-white mt-2">
                {index === 0
                    ? "Total Events"
                    : index === 1
                    ? "Approved Events"
                    : index === 2
                    ? "Pending Events"
                    : "Rejected Events"
                }
                 
                  
                </p>
              </div>
            ))}
          </div>
          
          {/* Calendar Section */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevMonth}
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
              onClick={handleNextMonth}
              className="bg-blue-500 text-white md:px-4 md:py-2 px-[6px] py-[4px] rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200"
            >
              Next &#8594;
            </button>
          </div>
          <div className="grid grid-cols-7 text-xs md:text-sm border border-blue-300 mb-2">
            <div className="p-2 md:p-4 text-center font-bold bg-blue-200 text-blue-700">Sun</div>
            <div className="p-2 md:p-4 text-center font-bold bg-blue-200 text-blue-700">Mon</div>
            <div className="p-2 md:p-4 text-center font-bold bg-blue-200 text-blue-700">Tue</div>
            <div className="p-2 md:p-4 text-center font-bold bg-blue-200 text-blue-700">Wed</div>
            <div className="p-2 md:p-4 text-center font-bold bg-blue-200 text-blue-700">Thu</div>
            <div className="p-2 md:p-4 text-center font-bold bg-blue-200 text-blue-700">Fri</div>
            <div className="p-2 md:p-4 text-center font-bold bg-blue-200 text-blue-700">Sat</div>
          </div>
          <div id="calendarDays" className="grid grid-cols-7 gap-1 md:gap-2 border border-blue-300">
            {renderDays()}
          </div>
        </div>
      </div>
    );
  };
  
  export default Calendar;
  

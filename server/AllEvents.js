
// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";

// const AllEvents = () => {
//   const [events, setEvents] = useState([]);
//   const [filters, setFilters] = useState({
//     sort: "desc", // Default to dates descending
//     organizer: "",
//     branch: "",
//     year: "",
//   });

//   const branches = ["PUC", "CSE", "ECE", "EEE", "Mechanical", "Civil", "Chemical"];
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i); // From 2000 to current year

//   // Fetch Events Function
//   const fetchEvents = useCallback(async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/events", { params: filters });
//       setEvents(response.data);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     }
//   }, [filters]);

//   useEffect(() => {
//     fetchEvents();
//   }, [fetchEvents]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">All Events</h1>

//       {/* Filter Section */}
//       <div className="flex flex-wrap gap-4 mb-4  ">
//         <select
//           name="sort"
//           value={filters.sort}
//           onChange={handleFilterChange}
//           className="border rounded p-2 shadow-lg"
//         >
//           <option value="desc">Date Descending</option>
//           <option value="asc">Date Ascending</option>
//         </select>

//         <input
//           type="text"
//           name="organizer"
//           placeholder="Filter by Organizer"
//           value={filters.organizer}
//           onChange={handleFilterChange}
//           className="border rounded p-2 shadow-lg"
//         />

//         <select
//           name="branch"
//           value={filters.branch}
//           onChange={handleFilterChange}
//           className="border rounded p-2 shadow-lg"
//         >
//           <option value="">Filter by Department</option>
//           {branches.map((branch) => (
//             <option key={branch} value={branch}>
//               {branch}
//             </option>
//           ))}
//         </select>

//         <select
//           name="year"
//           value={filters.year}
//           onChange={handleFilterChange}
//           className="border rounded p-2 shadow-lg"
//         >
//           <option value="">Filter by Year</option>
//           {years.map((year) => (
//             <option key={year} value={year}>
//               {year}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Events List */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {events.map((event) => (
//           <div key={event._id} className="p-4 border rounded shadow-lg bg-blue-50 border-l-[10px] border-l-blue-800">
//             <h2 className="text-lg font-bold">{event.eventName}</h2>
//             <p>{event.organizer}</p>
//             <p>Date: {event.date}</p>
//             <p>Time: {event.time}</p>
//             <p>Branch: {event.branch}</p>
//             <p>Year: {event.year}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
// export default AllEvents;
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
      const response = await axios.get("http://localhost:8080/api/events", { params: filters });
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
          <option value="asc" classNmae="text-blue-800 ">Date Ascending</option>
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
            <p>Time: {event.time}</p>
            <p>Branch: {event.branch}</p>
            <p>Year: {event.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllEvents;


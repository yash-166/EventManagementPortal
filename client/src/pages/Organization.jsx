import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Organizations = () => {


  const user = useSelector((state) => state.auth.user);
  console.log("Accept-reject:", user);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role == "organizer") { // Corrected condition
      navigate("/");
    }
  }, [user, navigate]);


  const organizations = [
    {
      name: "SDCAC",
      description: "The Student Development and Campus Activities Council conducts technical and cultural events to enhance student life.",
      logo: "sdcac.jpeg",
    },
    {
      name: "Student Mithra",
      description: "Student Mithra is similar to SDCAC, focusing on mentoring and organizing events for students.",
      logo: "sm.jpeg",
    },
    {
      name: "E-Crush",
      description: "E-Crush is dedicated to improving English language skills among students through various activities.",
      logo: "ecrush.jpeg",
    },
    {
      name: "Student Recreation Club",
      description: "The Student Recreation Club projects movies for students on weekends to promote relaxation and fun.",
      logo: "src.jpg",
    },
  ];



  return (
    <div className="bg-blue-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
          Organizations at RGUKT University
        </h1>
        <p className="text-center text-blue-600 mb-12">
          Discover the vibrant organizations that make RGUKT a dynamic and inclusive community. Get to know the mission and activities of each group.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {organizations.map((org, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <img
                src={org.logo}
                alt={org.name}
                className="w-24 h-24 object-contain mb-4"
              />
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                {org.name}
              </h2>
              <p className="text-blue-600">{org.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Organizations;

import { Menu, Transition, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils";
import { logout } from "../redux/slices/authSlice";
import { toast } from "react-toastify";

const UserAvatar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      localStorage.clear();
      dispatch(logout());
      navigate("/log-in");
      toast.success("You have been logged out successfully.");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const openProfileModal = () => setProfileModalOpen(true);
  const closeProfileModal = () => setProfileModalOpen(false);

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="w-8 h-8 2xl:w-12 2xl:h-12 items-center justify-center rounded-full bg-blue-500">
              <span className="text-white font-semibold">
                {getInitials(user?.name)}
              </span>
            </MenuButton>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right divide-gray-100 rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
              <div className="p-4">
                <MenuItem>
                  <button
                    onClick={openProfileModal}
                    className="text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base"
                  >
                    <FaUser className="mr-2" aria-hidden="true" />
                    Profile
                  </button>
                </MenuItem>

                <MenuItem>
                  <button
                    onClick={logoutHandler}
                    className="text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base"
                  >
                    <IoLogOutOutline className="mr-2" aria-hidden="true" />
                    Logout
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-blue-600">User Profile</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeProfileModal}
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              <table className="table-auto w-full text-left text-gray-700">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-semibold text-blue-600">Name:</td>
                    <td className="py-2">{user?.name || "N/A"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold text-blue-600">Email:</td>
                    <td className="py-2">{user?.email || "N/A"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold text-blue-600">Role:</td>
                    <td className="py-2">{user?.role || "N/A"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold text-blue-600">Department:</td>
                    <td className="py-2">{user?.department || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-blue-600">Year:</td>
                    <td className="py-2">{user?.year || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={closeProfileModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAvatar;

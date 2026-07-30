import { LogOut, UserCircle } from "lucide-react";

import "./BarberProfileMenu.scss";

const BarberProfileMenu = ({
  open,
  onClose,
  onLogout,
}) => {
  if (!open) return null;

  return (
    <>
      <div
        className="profile-menu-backdrop"
        onClick={onClose}
      />

      <div className="profile-menu">
        <div className="profile-menu__user">
          <img
            src="https://i.pravatar.cc/120"
            alt="Profile"
          />

          <div>
            <h4>
              Naturica Unisex Salon
            </h4>

            <span>
              Purnia, Bihar
            </span>
          </div>
        </div>

        <div className="profile-menu__divider" />

        <button
          className="profile-menu__item"
          onClick={() => {
            onClose();
          }}
        >
          <UserCircle size={18} />

          <span>My Profile</span>
        </button>

        <button
          className="profile-menu__item logout"
          onClick={() => {
            onLogout();
            onClose();
          }}
        >
          <LogOut size={18} />

          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

export default BarberProfileMenu;
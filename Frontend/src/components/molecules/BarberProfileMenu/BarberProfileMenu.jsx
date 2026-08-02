import { LogOut, UserCircle } from "lucide-react";

import useBarberProfile from "../../../hooks/useBarberProfile";
import "./BarberProfileMenu.scss";

const BarberProfileMenu = ({
  open,
  onClose,
  onLogout,
}) => {
  const { profile, loading } =
    useBarberProfile();

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
            src={
              profile?.profileImage ||
              "https://i.pravatar.cc/120"
            }
            alt={
              profile?.shopName ||
              "Profile"
            }
          />

          <div>
            <h4>
              {loading
                ? "Loading..."
                : profile?.shopName ||
                  "TrimTokyo"}
            </h4>

            <span>
              {loading
                ? "Loading..."
                : `${profile?.city || ""}${
                    profile?.city &&
                    profile?.state
                      ? ", "
                      : ""
                  }${profile?.state || ""}`}
            </span>
          </div>
        </div>

        <div className="profile-menu__divider" />

        <button
          className="profile-menu__item"
          onClick={onClose}
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
import "./BarberSidebar.scss";

import { NavLink } from "react-router-dom";

import { BARBER_SIDEBAR_ITEMS } from "../../../constants/barberSidebar";

const BarberSidebar = () => {
  return (
    <aside className="barber-sidebar">
      <nav className="barber-sidebar__nav">
        {BARBER_SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `barber-sidebar__item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default BarberSidebar;
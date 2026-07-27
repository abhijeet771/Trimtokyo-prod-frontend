import React, { useState } from "react";
import {  Menu,  X,  Headset,} from "lucide-react";
import Logo from "../../atoms/Logo/Logo";
import SidebarMenuItem from "../../molecules/SidebarMenuItem/SidebarMenuItem";
import {  SIDEBAR_MENU,  SIDEBAR_BOTTOM,} from "../../../constants/sidebar";
import "./Sidebar.scss";
const Sidebar = () => {

  const [open, setOpen] =  useState(false);

  const closeSidebar = () => {  setOpen(false);};

  return (
    <>

      {/* ================= MOBILE TOGGLE ================= */}

      <button        className="mobile-toggle"     onClick={() => setOpen(true)}>
        <Menu size={22} />
      </button>

      {/* ================= OVERLAY ================= */}

      <div    className={`sidebar-overlay ${  open ? "active" : ""}`}
        onClick={closeSidebar}
      />

      {/* ================= SIDEBAR ================= */}
      <aside        className={`sidebar ${    open ? "open" : ""}`}>

        {/* ================= TOP ================= */}
        <div className="sidebar__top">
          {/* MOBILE CLOSE */}
          <button  className="sidebar__close"  onClick={closeSidebar}>
            <X size={20} />
          </button>
          <Logo />
          <div className="sidebar__menu">
            {SIDEBAR_MENU.map(
              (item) => (
                <SidebarMenuItem  key={item.id}   item={item}
                  onClick={ closeSidebar}
                />
              )
            )}
          </div>
        </div>
        {/* ================= BOTTOM ================= */}
        <div className="sidebar__bottom">
          <div className="sidebar__bottom-menu">
            {SIDEBAR_BOTTOM.map(
              (item) => (
                <SidebarMenuItem  key={item.id}   item={item}
                  onClick={  closeSidebar}
                />
              )
            )}

          </div>
          <div className="sidebar-support">
            <div className="sidebar-support__icon">
              <Headset size={24} />
            </div>
            <h4>  Need Help? </h4>
            <p>Our support team is always here to help you out.</p>
            <button>   Contact Support  </button>
          </div>
        </div>
      </aside>

    </>
  );
};

export default Sidebar;
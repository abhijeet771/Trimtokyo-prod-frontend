import React, {  useEffect, useState,} from "react";
import {  Camera,  Mail,  Phone,  MapPin,  User,  CalendarDays,  Scissors,  ClipboardList,  LifeBuoy,  ArrowRight,} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/organisms/Sidebar/Sidebar";
import {  getProfile,  updateUserProfile,  uploadAvatar,} from "../services/api";

import "./Profile.scss";

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({   name: "",   email: "",
    role: "",
    phone: "",
    gender: "",
    age: "",
    address: "",
    avatar: "",
  });

  const [loading, setLoading] =    useState(true);
  const [editing, setEditing] =    useState(false);

  useEffect(() => {    fetchProfile();}, []);

  const fetchProfile = async () => {
    try {      const res = await getProfile();
      setProfile(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateUserProfile({
        phone: profile.phone,
        gender: profile.gender,
        age: profile.age,
        address: profile.address,
      });

      setEditing(false);    } catch (err) { console.error(err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;
    const formData = new FormData();

    formData.append( "avatar",file);
    try {

      const res = await uploadAvatar( formData);

      setProfile((prev) => ({        ...prev,
        avatar: res.data.data.avatar,
      }));

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="dashboard-layout">

      <Sidebar />
      <div className="profile-page">

        {/* ================= HEADER ================= */}

        <div className="profile-header">
          <div>
            <p className="profile-header__tag">  Dashboard / Profile    </p>
            <h2> My Profile </h2>
          </div>
        </div>

        {/* ================= PROFILE CARD ================= */}
        <div className="profile-card">

          {/* ================= LEFT ================= */}

          <div className="avatar-section">
            <div className="avatar-wrapper">

              <img src={
                  profile.avatar ? `${import.meta.env.VITE_API_URL}${profile.avatar}`
                    : "https://ui-avatars.com/api/?name=User&background=ede9fe&color=7b2cbf"
                }
                alt="avatar"
              />

              <label className="avatar-upload">
                <Camera size={18} />
                <input  type="file"   onChange={handleImageUpload }   hidden/>
              </label>

            </div>
            <h4> {profile.name}</h4>
            <p>  {profile.role} </p>
            <span> JPG, PNG or GIF </span>
          </div>

          {/* ================= RIGHT ================= */}

          <div className="profile-content">
            {/* BASIC INFO */}

            <div className="profile-grid">
              <div className="profile-input">

                <label>  Full Name  </label>
                <div className="input-wrapper">
                  <User size={18} />
                  <input value={   profile.name}  disabled/>
                </div>
              </div>
              <div className="profile-input">
                <label>     Email Address   </label>
                <div className="input-wrapper">
                  <Mail size={18} />

                  <input value={   profile.email}  disabled/>
                </div>
              </div>
              <div className="profile-input">
                <label>  Mobile Number  </label>
                <div className="input-wrapper">
                  <Phone size={18} />

                  <input  name="phone"     value={ profile.phone}
                    onChange={ handleChange}
                    disabled={   !editing}/>
                </div>
              </div>
              <div className="profile-input">

                <label>Gender   </label>
                <div className="input-wrapper">
                  <User size={18} />

                  <select  name="gender"
                    value={ profile.gender}
                    onChange={  handleChange}
                    disabled={   !editing}>
                    <option value="">  Select Gender </option>
                    <option value="male">   Male </option>
                    <option value="female"> Female  </option>
                  </select>
                </div>
              </div>

              <div className="profile-input">

                <label> Age </label>
                <div className="input-wrapper">
                  <CalendarDays size={18} />

                  <input name="age" type="number"
                   value={ profile.age || ""}
                    onChange={ handleChange}
                    disabled={ !editing}
                  />
                </div>
              </div>
            </div>
            {/* ADDRESS */}

            <div className="profile-input full-width">

              <label>  Address </label>

              <div className="textarea-wrapper">
                <MapPin size={18} />

                <textarea name="address" value={   profile.address }
                  onChange={   handleChange }
                  disabled={!editing }
                />
              </div>
            </div>
            {/* ACTIONS */}

            <div className="actions">

              {editing ? (
                <button  onClick={  handleSave}>
                  Save Changes
                </button>
              ) : (
                <button onClick={() =>setEditing(true)}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ================= BOTTOM GRID ================= */}

        <div className="profile-bottom-grid">

          {/* QUICK ACTIONS */}

          <div className="profile-box">

            <div className="profile-box__header">
              <div>
                <p>Shortcuts</p>
                <h3> Quick Actions </h3>
              </div>
            </div>

            <div className="quick-actions">

              <button onClick={() =>   navigate("/shop") }>
                <div>
                  <Scissors size={18} />
                  <span> Book Service</span>
                </div>
                <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate( "/bookings")} >
                <div>
                  <ClipboardList size={18} />
                  <span>View Bookings </span>
                </div>
                <ArrowRight size={16} />
              </button>

              <button onClick={() =>navigate("/contact") } >
                <div>
                  <LifeBuoy size={18} />

                  <span>Contact Support</span>
                </div>
                <ArrowRight size={16} />
              </button>

              <button onClick={() =>navigate("/shop")}>
                <div>
                  <Scissors size={18} />
                  <span>
                    Explore Barbers
                  </span>
                </div>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
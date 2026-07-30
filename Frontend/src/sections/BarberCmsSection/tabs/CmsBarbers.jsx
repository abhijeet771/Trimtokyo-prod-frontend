import { useState } from "react";

import {
  User,
  Plus,
  Trash2,
} from "lucide-react";

import "./CmsBarbers.scss";

const CmsBarbers = () => {
  const [barbers, setBarbers] =
    useState([
      {
        id: 1,
        name: "John Doe",
        designation: "Senior Barber",
        experience: "5",
        image:
          "",
      },
    ]);

  const handleChange = (
    id,
    field,
    value
  ) => {
    setBarbers((prev) =>
      prev.map((barber) =>
        barber.id === id
          ? {
              ...barber,
              [field]: value,
            }
          : barber
      )
    );
  };

  const addBarber = () => {
    setBarbers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        designation: "",
        experience: "",
        image: "",
      },
    ]);
  };

  const deleteBarber = (id) => {
    setBarbers((prev) =>
      prev.filter(
        (barber) =>
          barber.id !== id
      )
    );
  };

  return (
    <section className="cms-barbers">
      <div className="cms-barbers__header">
        <div>
          <h3>Barbers</h3>

          <p>
            Manage the barber team
            shown on your website.
          </p>
        </div>

        <button
          className="add-btn"
          onClick={addBarber}
        >
          <Plus size={18} />
          Add Barber
        </button>
      </div>

      <div className="barber-list">
        {barbers.map((barber) => (
          <div
            key={barber.id}
            className="barber-card"
          >
            <div className="avatar">
              {barber.image ? (
                <img
                  src={barber.image}
                  alt=""
                />
              ) : (
                <User size={34} />
              )}
            </div>

            <div className="barber-fields">
              <input
                type="text"
                placeholder="Barber Name"
                value={barber.name}
                onChange={(e) =>
                  handleChange(
                    barber.id,
                    "name",
                    e.target.value
                  )
                }
              />

              <input
                type="text"
                placeholder="Designation"
                value={
                  barber.designation
                }
                onChange={(e) =>
                  handleChange(
                    barber.id,
                    "designation",
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                placeholder="Experience (Years)"
                value={
                  barber.experience
                }
                onChange={(e) =>
                  handleChange(
                    barber.id,
                    "experience",
                    e.target.value
                  )
                }
              />

              <input
                type="text"
                placeholder="Profile Image URL"
                value={barber.image}
                onChange={(e) =>
                  handleChange(
                    barber.id,
                    "image",
                    e.target.value
                  )
                }
              />
            </div>

            <button
              className="delete-btn"
              onClick={() =>
                deleteBarber(
                  barber.id
                )
              }
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="save-bar">
        <button className="save-btn">
          Save Barbers
        </button>
      </div>
    </section>
  );
};

export default CmsBarbers;
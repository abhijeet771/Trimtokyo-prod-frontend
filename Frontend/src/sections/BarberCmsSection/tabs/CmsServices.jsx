import { useState } from "react";

import {
  Plus,
  Trash2,
  Scissors,
} from "lucide-react";

import "./CmsServices.scss";

const CmsServices = () => {
  const [services, setServices] =
    useState([
      {
        id: 1,
        name: "Hair Cut",
        price: "300",
        duration: "30",
      },
    ]);

  const handleChange = (
    id,
    field,
    value
  ) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? {
              ...service,
              [field]: value,
            }
          : service
      )
    );
  };

  const addService = () => {
    setServices((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        price: "",
        duration: "",
      },
    ]);
  };

  const deleteService = (id) => {
    setServices((prev) =>
      prev.filter(
        (service) =>
          service.id !== id
      )
    );
  };

  return (
    <section className="cms-services">
      <div className="cms-services__header">
        <div>
          <h3>Services</h3>

          <p>
            Manage the services
            displayed on your salon
            website.
          </p>
        </div>

        <button
          className="add-btn"
          onClick={addService}
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      <div className="service-list">
        {services.map((service) => (
          <div
            key={service.id}
            className="service-card"
          >
            <div className="service-icon">
              <Scissors size={26} />
            </div>

            <div className="service-fields">
              <input
                type="text"
                placeholder="Service Name"
                value={service.name}
                onChange={(e) =>
                  handleChange(
                    service.id,
                    "name",
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                placeholder="Price"
                value={service.price}
                onChange={(e) =>
                  handleChange(
                    service.id,
                    "price",
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                placeholder="Duration (mins)"
                value={service.duration}
                onChange={(e) =>
                  handleChange(
                    service.id,
                    "duration",
                    e.target.value
                  )
                }
              />
            </div>

            <button
              className="delete-btn"
              onClick={() =>
                deleteService(
                  service.id
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
          Save Services
        </button>
      </div>
    </section>
  );
};

export default CmsServices;
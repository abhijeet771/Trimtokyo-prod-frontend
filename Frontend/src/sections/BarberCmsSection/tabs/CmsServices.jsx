import { useEffect, useState } from "react";

import { Scissors } from "lucide-react";

import { toast } from "sonner";

import useUpdateBarberCms from "../../../hooks/useUpdateBarberCms";

import {
  updateBarberCmsServices,
} from "../../../services/api";

import "./CmsServices.scss";

const CmsServices = ({
  cms,
  allServices = [],
  refetch,
}) => {
  const [selectedServices, setSelectedServices] =
    useState([]);

  const {
    mutate,
    isPending,
  } = useUpdateBarberCms(
    updateBarberCmsServices
  );

  useEffect(() => {
    if (cms?.services) {
      setSelectedServices(
        cms.services.map(
          (service) => service._id
        )
      );
    }
  }, [cms]);

  const services =
    allServices?.services ||
    allServices?.data ||
    allServices ||
    [];

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id)
        ? prev.filter(
            (serviceId) =>
              serviceId !== id
          )
        : [...prev, id]
    );
  };

  const handleSave = () => {
    mutate(
      {
        services:
          selectedServices,
      },
      {
        onSuccess: (
          response
        ) => {
          toast.success(
            response?.message ||
              "Services updated successfully."
          );

          refetch?.();
        },

        onError: (error) => {
          toast.error(
            error?.response?.data
              ?.message ||
              "Failed to update services."
          );
        },
      }
    );
  };

  return (
    <section className="cms-services">
      <div className="cms-services__header">
        <div>
          <h3>Website Services</h3>

          <p>
            Choose which services
            should appear on your
            public website.
          </p>
        </div>
      </div>

      <div className="service-list">
        {services.length === 0 ? (
          <div className="empty-state">
            No services found.
            Create services first
            from the Services module.
          </div>
        ) : (
          services.map((service) => (
            <label
              key={service._id}
              className="service-card"
            >
              <div className="service-icon">
                <Scissors size={24} />
              </div>

              <div className="service-info">
                <h4>
                  {service.name}
                </h4>

                <p>
                  ₹{service.price} •{" "}
                  {service.duration} mins
                </p>
              </div>

              <input
                type="checkbox"
                checked={selectedServices.includes(
                  service._id
                )}
                onChange={() =>
                  toggleService(
                    service._id
                  )
                }
              />
            </label>
          ))
        )}
      </div>

      <div className="save-bar">
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending
            ? "Saving..."
            : "Save Services"}
        </button>
      </div>
    </section>
  );
};

export default CmsServices;
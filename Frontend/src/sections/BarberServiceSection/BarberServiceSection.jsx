import React, {  useState,  useEffect,} from "react";
import useBarberServices from "../../hooks/useBarberServices";
import useBarberProfile from "../../hooks/useBarberProfile";
import BarberServiceCard from "../../components/molecules/BarberServiceCard/BarberServiceCard";
import "./BarberServiceSection.scss";

const SERVICES_PER_PAGE = 5;

const BarberServiceSection = () => {
  const {
    services = [],
    loading,
    error,
    createService,
  } = useBarberServices();

  const { profile } = useBarberProfile();

  const [form, setForm] = useState({
    title: "",
    price: "",
    duration: "",
    description: "",
    gender: "",
    imageUrl: "",
  });

  const [currentPage, setCurrentPage] =
    useState(1);

  const totalPages = Math.ceil( services.length / SERVICES_PER_PAGE);

  const indexOfLast = currentPage * SERVICES_PER_PAGE;
  const indexOfFirst =  indexOfLast - SERVICES_PER_PAGE;

  const currentServices = services.slice(
    indexOfFirst,
    indexOfLast
  );

  useEffect(() => {
    if (
      currentPage > totalPages &&
      totalPages > 0
    ) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.price ||
      !form.duration ||
      !form.gender
    ) {
      alert(
        "Please fill all required fields"
      );

      return;
    }

    if (
      !profile ||
      profile.status !== "APPROVED"
    ) {
      alert(
        "Barber must be approved before adding services"
      );

      return;
    }

    try {
      await createService({
        ...form,

        price: Number(form.price),

        duration: Number(form.duration),
      });

      alert(
        "Service submitted for approval"
      );

      setForm({
        title: "",
        price: "",
        duration: "",
        description: "",
        gender: "",
        imageUrl: "",
      });

      setCurrentPage(1);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="barber-service-section">
      <h3>Manage Services</h3>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {profile?.status !== "APPROVED" && (
        <div className="warning">
          Barber must be approved before
          adding services.
        </div>
      )}

      {/* ================= FORM ================= */}

      <div className="service-form">
        <input
          name="title"
          placeholder="Service Title"
          value={form.title}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />

        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={form.duration}
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        {/* NEW IMAGE URL FIELD */}

        <input
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
        />

        {/* GENDER DROPDOWN */}

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="">
            Select Gender
          </option>

          <option value="male">
            Male
          </option>

          <option value="female">
            Female
          </option>

          <option value="other">
            Other
          </option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={
            profile?.status !== "APPROVED"
          }
        >
          Add Service
        </button>
      </div>

      {/* ================= SERVICE LIST ================= */}

      <div className="service-list">
        {services.length === 0 ? (
          <p className="empty">
            No services added yet.
          </p>
        ) : (
          currentServices.map((service) => (
            <BarberServiceCard
              key={service._id}
              service={service}
            />
          ))
        )}
      </div>

      {/* ================= PAGINATION ================= */}

      {services.length >
        SERVICES_PER_PAGE && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                (prev) => prev - 1
              )
            }
          >
            Prev
          </button>

          <span>
            Page {currentPage} of{" "}
            {totalPages}
          </span>

          <button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage(
                (prev) => prev + 1
              )
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BarberServiceSection;
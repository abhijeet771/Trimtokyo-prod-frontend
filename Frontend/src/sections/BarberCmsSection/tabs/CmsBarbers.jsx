import { useEffect, useState } from "react";
import {  User,  Plus,  Trash2,} from "lucide-react";
import { toast } from "sonner";
import useUpdateBarberCms from "../../../hooks/useUpdateBarberCms";
import "./CmsBarbers.scss";
import {  updateBarberCmsBarbers,} from "../../../services/api";

const CmsBarbers = ({  cms,  refetch,}) => {
  const [barbers, setBarbers] =    useState([]);
 const {  mutate,  isPending,} = useUpdateBarberCms(  updateBarberCmsBarbers);

  useEffect(() => {
    if (cms?.barbers) {
      setBarbers(cms.barbers);
    }
  }, [cms]);

  const handleChange = (index, field, value) => {
    setBarbers((prev) =>
      prev.map((barber, i) =>
        i === index
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
        name: "",
        designation: "",
        specialization: "",
        experience: "",
        image: "",
      },
    ]);
  };

  const deleteBarber = (index) => {
    setBarbers((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSave = () => {
    const payload = barbers.map(
      ({ _id, ...rest }) => rest
    );

    mutate(payload, {
      onSuccess: (response) => {
        toast.success(
          response?.message ||
            "Barbers updated successfully."
        );

        refetch?.();
      },

      onError: (error) => {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to update barbers."
        );
      },
    });
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
        <button   className="add-btn"   onClick={addBarber} >
          <Plus size={18} />
          Add Barber
        </button>
      </div>

      <div className="barber-list">
        {barbers.map(
          (barber, index) => (
            <div key={ barber._id ?? `new-${index}`} className="barber-card">
              <div className="avatar">
                {barber.image ? (
                  <img  src={barber.image}  alt=""/>
                ) : (
                  <User size={34} />
                )}
              </div>

              <div className="barber-fields">
                <input type="text" placeholder="Barber Name" value={barber.name}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                />

                <input type="text" placeholder="Designation"
                  value={ barber.designation }
                  onChange={(e) =>handleChange(
                      index,
                      "designation",
                      e.target.value
                    )
                  }
                />

                <input type="text" placeholder="Specialization"
                  value={  barber.specialization}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "specialization",
                      e.target.value
                    )
                  }
                />

                <input type="number"  placeholder="Experience (Years)"
                  value={ barber.experience }
                  onChange={(e) =>
                    handleChange(
                      index,
                      "experience",
                      e.target.value
                    )
                  }
                />

                <input type="text" placeholder="Profile Image URL"   value={barber.image }
                  onChange={(e) =>
                    handleChange(
                      index,
                      "image",
                      e.target.value
                    )
                  }
                />
              </div>

              <button  className="delete-btn" onClick={() =>
                  deleteBarber(
                    index
                  )
                }
              >
                <Trash2 size={18} />
              </button>
            </div>
          )
        )}
      </div>

      <div className="save-bar">
        <button className="save-btn" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Barbers"}
        </button>
      </div>
    </section>
  );
};

export default CmsBarbers;
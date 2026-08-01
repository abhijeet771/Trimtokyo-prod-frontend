import { useEffect, useState } from "react";
import {  Image,  Star,  Trash2,  Plus,  Eye,} from "lucide-react";
import { toast } from "sonner";
import useUpdateBarberCms from "../../../hooks/useUpdateBarberCms";
import {  updateBarberCmsImages,} from "../../../services/api";
import "./CmsImages.scss";

const CmsImages = ({  cms,  refetch,}) => {
  const [images, setImages] =    useState([]);
  const {    mutate,    isPending,  } = useUpdateBarberCms(    updateBarberCmsImages  );
  useEffect(() => {    if (cms?.images) {      setImages(cms.images);    }  }, [cms]);

  const handleChange = (    index,    value  ) => {
    setImages((prev) =>
      prev.map((img, i) =>
        i === index
          ? {
              ...img,
              url: value,
            }
          : img
      )
    );
  };

  const addImage = () => {
    setImages((prev) => [
      ...prev,
      {
        url: "",
        isCover: false,
        isFeatured: false,
        isVisible: true,
      },
    ]);
  };

  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const setFeatured = (index) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isFeatured: i === index,
      }))
    );
  };

  const toggleVisible = (index) => {
    setImages((prev) =>
      prev.map((img, i) =>
        i === index
          ? {
              ...img,
              isVisible:
                !img.isVisible,
            }
          : img
      )
    );
  };

  const handleSave = () => {
    const payload = images.map(
      ({ _id, ...rest }) => rest
    );

    mutate(payload, {
      onSuccess: (response) => {
        toast.success(
          response?.message ||
            "Images updated successfully."
        );

        refetch?.();
      },

      onError: (error) => {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to update images."
        );
      },
    });
  };

  return (
    <section className="cms-images">
      <div className="cms-images__header">
        <div>
          <h3>
            Image Management
          </h3>
          <p>
            Manage cover and gallery images for your salon website.
          </p>
        </div>

        <button  className="add-btn"  onClick={addImage}>
          <Plus size={18} />
          Add Image
        </button>
      </div>

      <div className="image-list">
        {images.map(
          (image, index) => (
            <div
              className="image-card"
              key={
                image._id ??
                `new-${index}`
              }
            >
              <div className="image-preview">
                {image.url ? (
                  <img
                    src={image.url}
                    alt=""
                  />
                ) : (
                  <div className="placeholder">
                    <Image
                      size={42}
                    />
                  </div>
                )}
              </div>

              <div className="image-info">
                <label>
                  {image.isCover
                    ? "Cover Image"
                    : "Gallery Image"}
                </label>

                <input
                  type="text"
                  placeholder="Paste image URL..."
                  value={
                    image.url
                  }
                  onChange={(e) =>
                    handleChange(
                      index,
                      e.target
                        .value
                    )
                  }
                />
              </div>

              <div className="image-actions">
                <button
                  className={
                    image.isFeatured
                      ? "featured active"
                      : "featured"
                  }
                  onClick={() =>
                    setFeatured(
                      index
                    )
                  }
                >
                  <Star
                    size={18}
                  />
                </button>

                <button
                  className={
                    image.isVisible
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    toggleVisible(
                      index
                    )
                  }
                >
                  <Eye
                    size={18}
                  />
                </button>

                <button
                  className="delete"
                  onClick={() =>
                    removeImage(
                      index
                    )
                  }
                >
                  <Trash2
                    size={18}
                  />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      <div className="save-bar">
        <button  className="save-btn" onClick={handleSave} disabled={isPending} >
          {isPending ? "Saving..." : "Save Images"}
        </button>
      </div>
    </section>
  );
};

export default CmsImages;
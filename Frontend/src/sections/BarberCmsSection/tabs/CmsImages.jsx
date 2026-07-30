import { useState } from "react";
import {
  Image,
  Star,
  Trash2,
  Plus,
  Eye,
} from "lucide-react";

import "./CmsImages.scss";

const CmsImages = () => {
  const [images, setImages] = useState([
    {
      id: 1,
      title: "Cover Image",
      url: "",
      featured: true,
    },
    {
      id: 2,
      title: "Gallery Image",
      url: "",
      featured: false,
    },
  ]);

  const handleChange = (
    id,
    value
  ) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id
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
        id: Date.now(),
        title: "Gallery Image",
        url: "",
        featured: false,
      },
    ]);
  };

  const removeImage = (id) => {
    setImages((prev) =>
      prev.filter(
        (img) => img.id !== id
      )
    );
  };

  const setFeatured = (id) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        featured: img.id === id,
      }))
    );
  };

  return (
    <section className="cms-images">
      <div className="cms-images__header">
        <div>
          <h3>
            Image Management
          </h3>

          <p>
            Manage cover and gallery
            images for your salon
            website.
          </p>
        </div>

        <button
          className="add-btn"
          onClick={addImage}
        >
          <Plus size={18} />
          Add Image
        </button>
      </div>

      <div className="image-list">
        {images.map((image) => (
          <div
            className="image-card"
            key={image.id}
          >
            <div className="image-preview">
              {image.url ? (
                <img
                  src={image.url}
                  alt={image.title}
                />
              ) : (
                <div className="placeholder">
                  <Image size={42} />
                </div>
              )}
            </div>

            <div className="image-info">
              <label>
                {image.title}
              </label>

              <input
                type="text"
                placeholder="Paste image URL..."
                value={image.url}
                onChange={(e) =>
                  handleChange(
                    image.id,
                    e.target.value
                  )
                }
              />
            </div>

            <div className="image-actions">
              <button
                className={
                  image.featured
                    ? "featured active"
                    : "featured"
                }
                onClick={() =>
                  setFeatured(
                    image.id
                  )
                }
              >
                <Star size={18} />
              </button>

              <button>
                <Eye size={18} />
              </button>

              <button
                className="delete"
                onClick={() =>
                  removeImage(
                    image.id
                  )
                }
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="save-bar">
        <button className="save-btn">
          Save Images
        </button>
      </div>
    </section>
  );
};

export default CmsImages;
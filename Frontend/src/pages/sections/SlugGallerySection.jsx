
import { useMemo, useState, useEffect } from "react";
import {
  Images,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

import "./SlugGallerySection.scss";

const getImageUrl = (image) => {
  if (typeof image === "string") return image;

  return (
    image?.url ||
    image?.imageUrl ||
    image?.src ||
    image?.secureUrl ||
    ""
  );
};

const getImageCategory = (image) =>
  String(image?.category || image?.type || "All").trim();

const getImageAlt = (image, index) =>
  image?.alt ||
  image?.title ||
  image?.caption ||
  `Salon gallery image ${index + 1}`;

const SlugGallerySection = ({ images = [] }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const galleryImages = useMemo(() => {
    if (!Array.isArray(images)) return [];

    return images
      .map((image, originalIndex) => ({
        originalIndex,
        url: getImageUrl(image),
        category: getImageCategory(image),
        alt: getImageAlt(image, originalIndex),
        caption:
          typeof image === "object"
            ? image?.caption || image?.title || ""
            : "",
      }))
      .filter((image) => Boolean(image.url));
  }, [images]);

  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        galleryImages
          .map((image) => image.category)
          .filter((category) => category && category !== "All")
      ),
    ],
    [galleryImages]
  );

  const filteredImages = useMemo(() => {
    if (activeCategory === "All") return galleryImages;

    return galleryImages.filter(
      (image) => image.category === activeCategory
    );
  }, [galleryImages, activeCategory]);

  const activeImage =
    activeImageIndex !== null
      ? filteredImages[activeImageIndex]
      : null;

  const closeLightbox = () => setActiveImageIndex(null);

  const showPrevious = () => {
    setActiveImageIndex((current) =>
      current === null
        ? null
        : (current - 1 + filteredImages.length) % filteredImages.length
    );
  };

  const showNext = () => {
    setActiveImageIndex((current) =>
      current === null
        ? null
        : (current + 1) % filteredImages.length
    );
  };

  useEffect(() => {
    if (activeImageIndex !== null && filteredImages.length === 0) {
      setActiveImageIndex(null);
    } else if (
      activeImageIndex !== null &&
      activeImageIndex >= filteredImages.length
    ) {
      setActiveImageIndex(null);
    }
  }, [activeImageIndex, filteredImages.length]);

  useEffect(() => {
    if (activeImageIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImageIndex, filteredImages.length]);

  if (galleryImages.length === 0) return null;

  return (
    <section className="slug-gallery" id="salon-gallery">
      <div className="slug-gallery__header">
        <div className="slug-gallery__heading">
          <span className="slug-gallery__heading-icon">
            <Images size={20} />
          </span>

          <div>
            <h2>Salon Gallery</h2>
            <p>
              Take a closer look at our salon, services, and atmosphere.
            </p>
          </div>
        </div>

        <span className="slug-gallery__count">
          {galleryImages.length}{" "}
          {galleryImages.length === 1 ? "photo" : "photos"}
        </span>
      </div>

      {categories.length > 1 && (
        <div
          className="slug-gallery__filters"
          aria-label="Filter gallery by category"
        >
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={`slug-gallery__filter ${
                activeCategory === category
                  ? "slug-gallery__filter--active"
                  : ""
              }`}
              onClick={() => {
                setActiveCategory(category);
                setActiveImageIndex(null);
              }}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {filteredImages.length > 0 ? (
        <div className="slug-gallery__grid">
          {filteredImages.map((image, index) => (
            <button
              type="button"
              className={`slug-gallery__item ${
                index === 0 ? "slug-gallery__item--featured" : ""
              }`}
              key={`${image.url}-${image.originalIndex}`}
              onClick={() => setActiveImageIndex(index)}
              aria-label={`View ${image.alt}`}
            >
              <img
                src={image.url}
                alt={image.alt}
                loading="lazy"
              />

              <span className="slug-gallery__item-overlay">
                <Maximize2 size={19} />
              </span>

              {image.caption && (
                <span className="slug-gallery__caption">
                  {image.caption}
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="slug-gallery__empty">
          No photos are available in this category.
        </div>
      )}

      {activeImage && (
        <div
          className="slug-gallery__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Salon photo viewer"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="slug-gallery__close"
            onClick={closeLightbox}
            aria-label="Close gallery"
          >
            <X size={23} />
          </button>

          {filteredImages.length > 1 && (
            <button
              type="button"
              className="slug-gallery__navigation slug-gallery__navigation--previous"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <figure
            className="slug-gallery__lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={activeImage.url} alt={activeImage.alt} />

            <figcaption>
              <span>{activeImage.caption || activeImage.alt}</span>
              <span>
                {activeImageIndex + 1} / {filteredImages.length}
              </span>
            </figcaption>
          </figure>

          {filteredImages.length > 1 && (
            <button
              type="button"
              className="slug-gallery__navigation slug-gallery__navigation--next"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              aria-label="Next photo"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default SlugGallerySection;

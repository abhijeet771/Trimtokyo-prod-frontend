
import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Star,
  Scissors,
  Clock3,
  Phone,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";

import "./SlugHeroSection.scss";

const getImageUrl = (image) => {
  if (typeof image === "string") {
    return image.trim();
  }

  if (!image || typeof image !== "object") {
    return "";
  }

  return (
    image.url ||
    image.imageUrl ||
    image.image ||
    image.src ||
    image.profileImage ||
    ""
  ).trim();
};

const SlugHeroSection = ({
  details = {},
  images = [],
  others = {},
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [failedImages, setFailedImages] = useState([]);

  const salonName =
    details.salonName ||
    details.shopName ||
    details.businessName ||
    "Salon Profile";

  const visibleImages = useMemo(() => {
    const sourceImages = Array.isArray(images) ? images : [];

    const normalizedImages = sourceImages
      .map((image, index) => {
        const url = getImageUrl(image);

        if (!url || image?.isVisible === false) {
          return null;
        }

        return {
          _id: image?._id || image?.id || `${url}-${index}`,
          url,
          isCover: Boolean(image?.isCover),
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) => Number(b.isCover) - Number(a.isCover)
      );

    // Fall back to the salon profile image when the gallery is empty.
    if (normalizedImages.length === 0) {
      const profileImage = getImageUrl(
        details.profileImage ||
          details.imageUrl ||
          details.image ||
          others.profileImage
      );

      if (profileImage) {
        normalizedImages.push({
          _id: `profile-${profileImage}`,
          url: profileImage,
          isCover: true,
        });
      }
    }

    return normalizedImages;
  }, [images, details, others]);

  useEffect(() => {
    setActiveImage(0);
    setFailedImages([]);
  }, [visibleImages]);

  const galleryImages = visibleImages.slice(0, 3);

  const currentImage =
    galleryImages[activeImage] || galleryImages[0];

  const mainImage =
    currentImage && !failedImages.includes(currentImage.url)
      ? currentImage
      : galleryImages.find(
          (image) => !failedImages.includes(image.url)
        );

  const address =
    details.address ||
    details.fullAddress ||
    (typeof details.location === "string"
      ? details.location
      : "") ||
    "";

  const phone = details.phone || details.contactNumber || "";
  const openingTime = details.openingTime || "";
  const closingTime = details.closingTime || "";

  const businessType =
    details.businessType ||
    others.businessType ||
    "Barber Shop";

  const rating = Number(
    details.avgRating ?? others.avgRating ?? 0
  );

  const totalReviews = Number(
    details.totalReviews ?? others.totalReviews ?? 0
  );

  const handlePreviousImage = () => {
    if (galleryImages.length < 2) return;

    setActiveImage((current) =>
      current === 0
        ? galleryImages.length - 1
        : current - 1
    );
  };

  const handleNextImage = () => {
    if (galleryImages.length < 2) return;

    setActiveImage((current) =>
      current === galleryImages.length - 1
        ? 0
        : current + 1
    );
  };

  const handleImageError = (url) => {
    setFailedImages((current) =>
      current.includes(url) ? current : [...current, url]
    );
  };

  return (
    <section className="slug-hero">
      <div className="slug-hero__layout">
        <div className="slug-hero__main">
          {/* SALON IMAGE GALLERY */}
          <div className="slug-hero__gallery">
            <div className="slug-hero__main-image">
              {mainImage ? (
                <img
                  key={mainImage.url}
                  src={mainImage.url}
                  alt={salonName}
                  className="slug-hero__image"
                  onError={() =>
                    handleImageError(mainImage.url)
                  }
                />
              ) : (
                <div className="slug-hero__image-placeholder">
                  <ImageIcon size={34} />
                  <span>Salon photos coming soon</span>
                </div>
              )}

              {details.isFeatured && (
                <span className="slug-hero__featured">
                  Featured
                </span>
              )}

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    className="slug-hero__gallery-arrow slug-hero__gallery-arrow--left"
                    onClick={handlePreviousImage}
                    aria-label="Previous salon photo"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    className="slug-hero__gallery-arrow slug-hero__gallery-arrow--right"
                    onClick={handleNextImage}
                    aria-label="Next salon photo"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {visibleImages.length > 0 && (
                <span className="slug-hero__photo-count">
                  <ImageIcon size={14} />
                  {visibleImages.length} photos
                </span>
              )}
            </div>

            {/* GALLERY THUMBNAILS */}
            <div className="slug-hero__thumbnails">
              {galleryImages.slice(0, 2).map((image, index) => (
                <button
                  type="button"
                  key={image._id}
                  className={`slug-hero__thumbnail ${
                    activeImage === index
                      ? "slug-hero__thumbnail--active"
                      : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View salon photo ${index + 1}`}
                >
                  {failedImages.includes(image.url) ? (
                    <Scissors size={22} />
                  ) : (
                    <img
                      src={image.url}
                      alt={`${salonName} ${index + 1}`}
                      onError={() =>
                        handleImageError(image.url)
                      }
                    />
                  )}
                </button>
              ))}

              {visibleImages.length > 3 && (
                <button
                  type="button"
                  className="slug-hero__thumbnail slug-hero__thumbnail--more"
                  onClick={handleNextImage}
                  aria-label="View more salon photos"
                >
                  {failedImages.includes(visibleImages[3].url) ? (
                    <Scissors size={22} />
                  ) : (
                    <img
                      src={visibleImages[3].url}
                      alt={`${salonName} gallery`}
                      onError={() =>
                        handleImageError(visibleImages[3].url)
                      }
                    />
                  )}

                  <span>+{visibleImages.length - 3}</span>
                </button>
              )}

              {galleryImages.length === 1 && (
                <div className="slug-hero__thumbnail-empty">
                  <Scissors size={22} />
                </div>
              )}
            </div>
          </div>

          {/* SALON INFORMATION */}
          <div className="slug-hero__summary">
            <h1>{salonName}</h1>

            <div className="slug-hero__meta">
              <span className="slug-hero__rating">
                <Star size={17} fill="currentColor" />
                <strong>{rating.toFixed(1)}</strong>
                <span>({totalReviews} reviews)</span>
              </span>

              <span className="slug-hero__meta-divider" />

              <span className="slug-hero__business-type">
                <Scissors size={16} />
                {businessType}
              </span>
            </div>

            {address && (
              <div className="slug-hero__detail">
                <MapPin size={17} />
                <span>{address}</span>
              </div>
            )}

            <div className="slug-hero__quick-details">
              {(openingTime || closingTime) && (
                <div className="slug-hero__quick-item">
                  <Clock3 size={17} />
                  <span>
                    {openingTime || "Opening hours"}
                    {closingTime ? ` – ${closingTime}` : ""}
                  </span>
                </div>
              )}

              {phone && (
                <a
                  className="slug-hero__quick-item"
                  href={`tel:${phone}`}
                >
                  <Phone size={16} />
                  <span>{phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SlugHeroSection;

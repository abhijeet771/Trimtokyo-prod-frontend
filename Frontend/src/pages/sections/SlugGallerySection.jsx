import "./SlugGallerySection.scss";

const SlugGallerySection = ({
  images = [],
}) => {
  const galleryImages =
    images.filter(
      (image) => !image.isCover
    );

  if (
    galleryImages.length === 0
  ) {
    return null;
  }

  return (
    <section className="slug-gallery-section">
      <div className="slug-container">
        <div className="section-header">
          <span>
            Our Gallery
          </span>

          <h2>
            Inside Our Salon
          </h2>

          <p>
            Take a look at our
            premium ambience,
            professional styling and
            happy customers.
          </p>
        </div>

        <div className="gallery-grid">
          {galleryImages.map(
            (image, index) => (
              <div
                key={
                  image._id ??
                  index
                }
                className="gallery-card"
              >
                <img
                  src={image.url}
                  alt={`Gallery ${
                    index + 1
                  }`}
                />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default SlugGallerySection;
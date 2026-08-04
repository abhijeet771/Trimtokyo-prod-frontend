import "./AboutHeroTab.scss";

const AboutHeroTab = () => {
  return (
    <div className="about-hero-tab">
      <div className="about-card">
        <div className="about-card__header">
          <div>
            <h2>About Hero</h2>
            <p>Manage the About page hero section.</p>
          </div>

          <label className="switch">
            <span>Enable Section</span>
            <input
              type="checkbox"
              defaultChecked
            />
          </label>
        </div>

        <div className="about-grid">
          <div className="form-group full">
            <label>Heading</label>

            <textarea
              rows={3}
              placeholder="Professional Grooming, Delivered to Your Doorstep"
            />
          </div>

          <div className="form-group full">
            <label>Description</label>

            <textarea
              rows={3}
              placeholder="Book trusted barbers near you or register as a professional and grow your business with our platform."
            />
          </div>

          <div className="form-group">
            <label>Primary Button Text</label>

            <input
              type="text"
              placeholder="Book a Barber"
            />
          </div>

          <div className="form-group">
            <label>Primary Button Link</label>

            <input
              type="text"
              placeholder="/search"
            />
          </div>

          <div className="form-group">
            <label>Secondary Button Text</label>

            <input
              type="text"
              placeholder="Register as Barber"
            />
          </div>

          <div className="form-group">
            <label>Secondary Button Link</label>

            <input
              type="text"
              placeholder="/register/barber"
            />
          </div>

          <div className="form-group full">
            <label>Hero Image URL</label>

            <input
              type="text"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHeroTab;
import "./HeroTab.scss";

const HeroTab = () => {
  return (
    <div className="hero-tab">
      {/* Hero Settings */}
      <div className="hero-card">
        <div className="hero-card__header">
          <div>
            <h2>Hero Section</h2>
            <p>Manage the homepage hero section.</p>
          </div>

          <label className="switch">
            <span>Enable Hero</span>
            <input type="checkbox" defaultChecked />
          </label>
        </div>

        <div className="hero-grid">
          {/* Badge */}
          <div className="form-group">
            <label>Badge Text</label>
            <input
              type="text"
              placeholder="HAIR. STYLE. YOU."
            />
          </div>

          {/* Heading */}
          <div className="form-group full">
            <label>Heading</label>
            <textarea
              rows={3}
              placeholder="TRY VIRAT KOHLI HAIRSTYLE"
            />
          </div>

          {/* Description */}
          <div className="form-group full">
            <label>Description</label>
            <textarea
              rows={2}
              placeholder="Try everyday something new"
            />
          </div>

          {/* Button */}
          <div className="form-group">
            <label>Primary Button Text</label>
            <input
              type="text"
              placeholder="POPULAR NOW"
            />
          </div>

          <div className="form-group">
            <label>Primary Button Link</label>
            <input
              type="text"
              placeholder="/popular"
            />
          </div>

         {/* Hero Image */}
           <div className="form-group full">
            <label>Hero Image URL</label>
  <input
    type="text"
    placeholder="https://res.cloudinary.com/.../hero.webp"
  />
</div>

          {/* Background */}
          <div className="form-group">
            <label>Background Type</label>

            <select>
              <option>Gradient</option>
              <option>Solid</option>
              <option>Image</option>
            </select>
          </div>

          <div className="form-group">
            <label>Background Color</label>

            <input
              type="text"
              placeholder="#F5F2FF"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroTab;
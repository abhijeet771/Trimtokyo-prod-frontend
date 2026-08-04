import "./ExploreStylesTab.scss";

const ExploreStylesTab = () => {
  return (
    <div className="explore-tab">
      <div className="explore-card">
        <div className="explore-card__header">
          <div>
            <h2>Explore Styles Section</h2>
            <p>Manage the Explore Styles section displayed below Hero.</p>
          </div>

          <label className="switch">
            <span>Enable Section</span>
            <input type="checkbox" defaultChecked />
          </label>
        </div>

        <div className="explore-grid">
          <div className="form-group full">
            <label>Section Title</label>

            <input
              type="text"
              placeholder="EXPLORE CELEBRITY STYLES"
            />
          </div>

          <div className="form-group full">
            <label>Section Description</label>

            <textarea
              rows={3}
              placeholder="Discover trending celebrity hairstyles."
            />
          </div>
        </div>
      </div>

      <div className="explore-card">
        <div className="explore-card__header">
          <div>
            <h2>Style Cards</h2>
            <p>Add and manage hairstyle cards.</p>
          </div>

          <button className="add-btn">
            + Add Style
          </button>
        </div>

        <div className="style-card">
          <div className="style-grid">
            <div className="form-group">
              <label>Celebrity Name</label>

              <input
                type="text"
                placeholder="Virat Kohli"
              />
            </div>

            <div className="form-group">
              <label>Hairstyle Name</label>

              <input
                type="text"
                placeholder="Modern Fade"
              />
            </div>

            <div className="form-group full">
              <label>Image URL</label>

              <input
                type="text"
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label>Button Text</label>

              <input
                type="text"
                placeholder="Try Now"
              />
            </div>

            <div className="form-group">
              <label>Slug</label>

              <input
                type="text"
                placeholder="/hairstyles/virat-kohli"
              />
            </div>

            <div className="form-group">
              <label>Display Order</label>

              <input
                type="number"
                placeholder="1"
              />
            </div>

            <div className="form-group">
              <label>Enabled</label>

              <select>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreStylesTab;
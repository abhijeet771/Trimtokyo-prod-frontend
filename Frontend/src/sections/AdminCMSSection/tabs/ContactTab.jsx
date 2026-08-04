import "./ContactTab.scss";

const ContactTab = () => {
  return (
    <div className="contact-tab">
      {/* Section Settings */}

      <div className="contact-card">
        <div className="contact-card__header">
          <div>
            <h2>Contact Section</h2>
            <p>Manage your contact section.</p>
          </div>

          <label className="switch">
            <span>Enable Section</span>

            <input
              type="checkbox"
              defaultChecked
            />
          </label>
        </div>

        <div className="contact-grid">
          <div className="form-group full">
            <label>Section Title</label>

            <input
              type="text"
              placeholder="Get in Touch"
            />
          </div>

          <div className="form-group full">
            <label>Section Description</label>

            <textarea
              rows={3}
              placeholder="Have questions or want to partner with us? Reach out through any of the channels below."
            />
          </div>
        </div>
      </div>

      {/* Contact Cards */}

      <div className="contact-card">
        <div className="contact-card__header">
          <div>
            <h2>Contact Cards</h2>
            <p>
              Add and manage contact methods.
            </p>
          </div>

          <button className="add-btn">
            + Add Contact
          </button>
        </div>

        {/* Contact Item */}

        <div className="contact-item">
          <div className="contact-item__header">
            <h3>Contact #1</h3>
          </div>

          <div className="contact-grid">
            <div className="form-group">
              <label>Lucide Icon</label>

              <input
                type="text"
                placeholder="Instagram"
              />
            </div>

            <div className="form-group">
              <label>Title</label>

              <input
                type="text"
                placeholder="Instagram"
              />
            </div>

            <div className="form-group full">
              <label>Value</label>

              <input
                type="text"
                placeholder="@trimTokyo"
              />
            </div>

            <div className="form-group">
              <label>Button Text</label>

              <input
                type="text"
                placeholder="Open Profile"
              />
            </div>

            <div className="form-group">
              <label>Button Link</label>

              <input
                type="text"
                placeholder="https://instagram.com/trimtokyo"
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

        {/* Contact Item */}

        <div className="contact-item">
          <div className="contact-item__header">
            <h3>Contact #2</h3>
          </div>

          <div className="contact-grid">
            <div className="form-group">
              <label>Lucide Icon</label>

              <input
                type="text"
                placeholder="Phone"
              />
            </div>

            <div className="form-group">
              <label>Title</label>

              <input
                type="text"
                placeholder="Contact Number"
              />
            </div>

            <div className="form-group full">
              <label>Value</label>

              <input
                type="text"
                placeholder="+91 91109 31602"
              />
            </div>

            <div className="form-group">
              <label>Button Text</label>

              <input
                type="text"
                placeholder="Call Now"
              />
            </div>

            <div className="form-group">
              <label>Button Link</label>

              <input
                type="text"
                placeholder="tel:+919110931602"
              />
            </div>

            <div className="form-group">
              <label>Display Order</label>

              <input
                type="number"
                placeholder="2"
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

        {/* Contact Item */}

        <div className="contact-item">
          <div className="contact-item__header">
            <h3>Contact #3</h3>
          </div>

          <div className="contact-grid">
            <div className="form-group">
              <label>Lucide Icon</label>

              <input
                type="text"
                placeholder="Mail"
              />
            </div>

            <div className="form-group">
              <label>Title</label>

              <input
                type="text"
                placeholder="Email"
              />
            </div>

            <div className="form-group full">
              <label>Value</label>

              <input
                type="text"
                placeholder="trimtokyo4@gmail.com"
              />
            </div>

            <div className="form-group">
              <label>Button Text</label>

              <input
                type="text"
                placeholder="Send Email"
              />
            </div>

            <div className="form-group">
              <label>Button Link</label>

              <input
                type="text"
                placeholder="mailto:trimtokyo4@gmail.com"
              />
            </div>

            <div className="form-group">
              <label>Display Order</label>

              <input
                type="number"
                placeholder="3"
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

export default ContactTab;
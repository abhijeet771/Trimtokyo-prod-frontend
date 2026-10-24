import "./FooterCMSTabs.scss";

const FooterCMSTab = () => {
  return (
    <div className="footer-cms-tab">
      {/* Footer Settings */}
      <div className="footer-cms-card">
        <div className="footer-cms-card__header">
          <div>
            <h2>Footer Settings</h2>
            <p>Manage your website footer.</p>
          </div>

          <label className="footer-cms-switch">
            <span>Enable Footer</span>
            <input
              type="checkbox"
              defaultChecked
            />
          </label>
        </div>

        <div className="footer-cms-grid">
          <div className="footer-cms-form-group">
            <label>Logo URL</label>

            <input
              type="text"
              placeholder="https://..."
            />
          </div>

          <div className="footer-cms-form-group">
            <label>Brand Name</label>

            <input
              type="text"
              placeholder="TrimTokyo"
            />
          </div>

          <div className="footer-cms-form-group full">
            <label>Description</label>

            <textarea
              rows={3}
              placeholder="India's modern barber & salon booking platform."
            />
          </div>

          <div className="footer-cms-form-group">
            <label>Background Color</label>

            <input
              type="text"
              placeholder="#0F172A"
            />
          </div>

          <div className="footer-cms-form-group">
            <label>Text Color</label>

            <input
              type="text"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
      </div>

      {/* Footer Columns */}
      <div className="footer-cms-card">
        <div className="footer-cms-card__header">
          <div>
            <h2>Footer Columns</h2>
            <p>Manage footer navigation columns.</p>
          </div>

          <button className="footer-cms-add-btn">
            + Add Column
          </button>
        </div>

        <div className="footer-cms-column">
          <div className="footer-cms-column__header">
            <h3>Column 1</h3>

            <button className="footer-cms-add-btn small">
              + Add Link
            </button>
          </div>

          <div className="footer-cms-grid">
            <div className="footer-cms-form-group">
              <label>Column Title</label>

              <input
                type="text"
                placeholder="Company"
              />
            </div>

            <div className="footer-cms-form-group">
              <label>Display Order</label>

              <input
                type="number"
                placeholder="1"
              />
            </div>

            <div className="footer-cms-form-group">
              <label>Enabled</label>

              <select>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>

          {/* Link 1 */}
          <div className="footer-cms-link">
            <div className="footer-cms-grid">
              <div className="footer-cms-form-group">
                <label>Link Title</label>

                <input
                  type="text"
                  placeholder="About Us"
                />
              </div>

              <div className="footer-cms-form-group">
                <label>Link URL</label>

                <input
                  type="text"
                  placeholder="/about"
                />
              </div>

              <div className="footer-cms-form-group">
                <label>Display Order</label>

                <input
                  type="number"
                  placeholder="1"
                />
              </div>

              <div className="footer-cms-form-group">
                <label>Enabled</label>

                <select>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Link 2 */}
          <div className="footer-cms-link">
            <div className="footer-cms-grid">
              <div className="footer-cms-form-group">
                <label>Link Title</label>

                <input
                  type="text"
                  placeholder="Blog"
                />
              </div>

              <div className="footer-cms-form-group">
                <label>Link URL</label>

                <input
                  type="text"
                  placeholder="/blog"
                />
              </div>

              <div className="footer-cms-form-group">
                <label>Display Order</label>

                <input
                  type="number"
                  placeholder="2"
                />
              </div>

              <div className="footer-cms-form-group">
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

      {/* Social Media */}
      <div className="footer-cms-card">
        <div className="footer-cms-card__header">
          <div>
            <h2>Social Media</h2>
            <p>Manage footer social links.</p>
          </div>

          <button className="footer-cms-add-btn">
            + Add Social
          </button>
        </div>

        <div className="footer-cms-grid">
          <div className="footer-cms-form-group">
            <label>Platform</label>

            <input
              type="text"
              placeholder="Twitter"
            />
          </div>

          <div className="footer-cms-form-group">
            <label>Lucide Icon</label>

            <input
              type="text"
              placeholder="Twitter"
            />
          </div>

          <div className="footer-cms-form-group full">
            <label>URL</label>

            <input
              type="text"
              placeholder="https://twitter.com/trimtokyo"
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-cms-card">
        <div className="footer-cms-card__header">
          <div>
            <h2>Bottom Footer</h2>
            <p>Manage copyright and bottom links.</p>
          </div>
        </div>

        <div className="footer-cms-grid">
          <div className="footer-cms-form-group full">
            <label>Copyright</label>

            <input
              type="text"
              placeholder="© 2026 TrimTokyo. All rights reserved."
            />
          </div>

          <div className="footer-cms-form-group full">
            <label>Bottom Links</label>

            <textarea
              rows={3}
              placeholder={`Privacy
Terms
Cookies`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterCMSTab;
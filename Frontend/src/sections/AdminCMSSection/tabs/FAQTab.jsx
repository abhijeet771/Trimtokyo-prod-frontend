import "./FAQTab.scss";

const FAQTab = () => {
  return (
    <div className="faq-tab">
      {/* Section */}
      <div className="faq-card">
        <div className="faq-card__header">
          <div>
            <h2>FAQ Section</h2>
            <p>Manage Frequently Asked Questions.</p>
          </div>

          <label className="switch">
            <span>Enable Section</span>
            <input
              type="checkbox"
              defaultChecked
            />
          </label>
        </div>

        <div className="faq-grid">
          <div className="form-group full">
            <label>Section Title</label>

            <input
              type="text"
              placeholder="Frequently Asked Questions"
            />
          </div>

          <div className="form-group full">
            <label>Section Description</label>

            <textarea
              rows={3}
              placeholder="Everything you need to know about orders, payments and delivery."
            />
          </div>
        </div>
      </div>

      {/* FAQs */}

      <div className="faq-card">
        <div className="faq-card__header">
          <div>
            <h2>FAQ Items</h2>
            <p>Add and manage FAQs.</p>
          </div>

          <button className="add-btn">
            + Add FAQ
          </button>
        </div>

        {/* FAQ */}

        <div className="faq-item">
          <div className="faq-item__header">
            <h3>FAQ #1</h3>
          </div>

          <div className="faq-grid">
            <div className="form-group full">
              <label>Question</label>

              <input
                type="text"
                placeholder="What is the Barber Delivery System?"
              />
            </div>

            <div className="form-group full">
              <label>Answer</label>

              <textarea
                rows={5}
                placeholder="The Barber Delivery System is..."
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
              <label>Initially Expanded</label>

              <select>
                <option>Yes</option>
                <option>No</option>
              </select>
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

        {/* FAQ */}

        <div className="faq-item">
          <div className="faq-item__header">
            <h3>FAQ #2</h3>
          </div>

          <div className="faq-grid">
            <div className="form-group full">
              <label>Question</label>

              <input
                type="text"
                placeholder="Is the service available outside Purnia?"
              />
            </div>

            <div className="form-group full">
              <label>Answer</label>

              <textarea
                rows={5}
                placeholder="Yes, we are expanding city by city..."
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
              <label>Initially Expanded</label>

              <select>
                <option>No</option>
                <option>Yes</option>
              </select>
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

export default FAQTab;
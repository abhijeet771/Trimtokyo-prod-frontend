import "./WhyChooseTab.scss";
import {
  Clock3,
  CircleCheckBig,
  House,
} from "lucide-react";

const WhyChooseTab = () => {
  return (
    <div className="why-choose-tab">
      {/* Section */}
      <div className="why-card">
        <div className="why-card__header">
          <div>
            <h2>Why Choose Us</h2>
            <p>
              Manage the Why Choose Us section.
            </p>
          </div>

          <label className="switch">
            <span>Enable Section</span>
            <input
              type="checkbox"
              defaultChecked
            />
          </label>
        </div>

        <div className="why-grid">
          <div className="form-group full">
            <label>Section Title</label>

            <input
              type="text"
              placeholder="Why Choose Our Service"
            />
          </div>

          <div className="form-group full">
            <label>Section Description</label>

            <textarea
              rows={3}
              placeholder="Tell users why they should choose your platform."
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="why-card">
        <div className="why-card__header">
          <div>
            <h2>Benefit Cards</h2>
            <p>
              Manage all benefit cards.
            </p>
          </div>

          <button className="add-btn">
            + Add Card
          </button>
        </div>

        {/* Card 1 */}

        <div className="benefit-card">
          <div className="benefit-icon">
            <Clock3 size={24} />
          </div>

          <div className="why-grid">
            <div className="form-group">
              <label>Lucide Icon</label>

              <input
                type="text"
                placeholder="Clock3"
              />
            </div>

            <div className="form-group">
              <label>Title</label>

              <input
                type="text"
                placeholder="No Waiting"
              />
            </div>

            <div className="form-group full">
              <label>Description</label>

              <textarea
                rows={3}
                placeholder="Skip long queues and get service exactly at your booked time."
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

        {/* Card 2 */}

        <div className="benefit-card">
          <div className="benefit-icon">
            <CircleCheckBig size={24} />
          </div>

          <div className="why-grid">
            <div className="form-group">
              <label>Lucide Icon</label>

              <input
                type="text"
                placeholder="CircleCheckBig"
              />
            </div>

            <div className="form-group">
              <label>Title</label>

              <input
                type="text"
                placeholder="Easy Booking"
              />
            </div>

            <div className="form-group full">
              <label>Description</label>

              <textarea
                rows={3}
                placeholder="Book your slot in seconds with a smooth and simple process."
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

        {/* Card 3 */}

        <div className="benefit-card">
          <div className="benefit-icon">
            <House size={24} />
          </div>

          <div className="why-grid">
            <div className="form-group">
              <label>Lucide Icon</label>

              <input
                type="text"
                placeholder="House"
              />
            </div>

            <div className="form-group">
              <label>Title</label>

              <input
                type="text"
                placeholder="At Home Comfort"
              />
            </div>

            <div className="form-group full">
              <label>Description</label>

              <textarea
                rows={3}
                placeholder="Enjoy professional grooming services at your home."
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

export default WhyChooseTab;
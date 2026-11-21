
import React, { useMemo, useState } from "react";
import {
  X,
  IndianRupee,
  CalendarDays,
  BriefcaseBusiness,
  Megaphone,
} from "lucide-react";
import "./ProfitDialog.scss";

const getToday = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();

  return new Date(today.getTime() - offset * 60000)
    .toISOString()
    .split("T")[0];
};

const getInitialFormData = () => ({
  date: getToday(),
  category: "",
  grossRevenue: "",
  operationalCost: "",
  marketingCost: "",
});

const ProfitDialog = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(getInitialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Net Revenue = Gross Revenue - Operational Cost
  const netRevenue = useMemo(() => {
    if (
      formData.grossRevenue === "" ||
      formData.operationalCost === ""
    ) {
      return "";
    }

    const gross = Number(formData.grossRevenue);
    const operational = Number(formData.operationalCost);

    if (!Number.isFinite(gross) || !Number.isFinite(operational)) {
      return "";
    }

    return gross - operational;
  }, [formData.grossRevenue, formData.operationalCost]);

  // Net Profit = Net Revenue - Marketing Cost
  const netProfit = useMemo(() => {
    if (
      netRevenue === "" ||
      formData.marketingCost === ""
    ) {
      return "";
    }

    const marketing = Number(formData.marketingCost);

    if (!Number.isFinite(marketing)) {
      return "";
    }

    return netRevenue - marketing;
  }, [netRevenue, formData.marketingCost]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleClose = () => {
    if (loading) return;

    setError("");
    setFormData(getInitialFormData());
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.date ||
      !formData.category.trim() ||
      formData.grossRevenue === "" ||
      formData.operationalCost === "" ||
      formData.marketingCost === ""
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const gross = Number(formData.grossRevenue);
    const operational = Number(formData.operationalCost);
    const marketing = Number(formData.marketingCost);

    if (
      !Number.isFinite(gross) ||
      !Number.isFinite(operational) ||
      !Number.isFinite(marketing) ||
      gross < 0 ||
      operational < 0 ||
      marketing < 0
    ) {
      setError(
        "Please enter valid amounts greater than or equal to zero."
      );
      return;
    }

    if (operational > gross) {
      setError(
        "Operational cost cannot be greater than gross revenue."
      );
      return;
    }

    const calculatedNetRevenue = gross - operational;
    const calculatedNetProfit = calculatedNetRevenue - marketing;

    setLoading(true);

    try {
      await onSubmit({
        date: formData.date,
        category: formData.category.trim(),
        grossRevenue: gross,
        operationalCost: operational,
        marketingCost: marketing,
      });

      setFormData(getInitialFormData());
      setError("");
      onClose();
    } catch (err) {
      console.error("Failed to add profit entry:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save financial entry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="profit-dialog__overlay"
      onClick={handleClose}
    >
      <div
        className="profit-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profit-dialog-title"
      >
        {/* Header */}
        <div className="profit-dialog__header">
          <div>
            <span className="profit-dialog__eyebrow">
              FINANCIAL MANAGEMENT
            </span>

            <h2 id="profit-dialog-title">
              Add Financial Entry
            </h2>

            <p>
              Record revenue, operational costs and marketing costs.
            </p>
          </div>

          <button
            type="button"
            className="profit-dialog__close"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Entry Details */}
          <div className="profit-dialog__section">
            <h3>Entry Details</h3>

            <div className="profit-dialog__grid">
              <div className="profit-dialog__field">
                <label htmlFor="profit-date">
                  Date
                </label>

                <div className="profit-dialog__input-wrap">
                  <CalendarDays size={17} />

                  <input
                    id="profit-date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="profit-dialog__field">
                <label htmlFor="profit-category">
                  Business Category
                </label>

                <div className="profit-dialog__input-wrap">
                  <BriefcaseBusiness size={17} />

                  <input
                    id="profit-category"
                    type="text"
                    name="category"
                    placeholder="e.g. Home Service"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Details */}
          <div className="profit-dialog__section">
            <h3>Revenue Details</h3>

            <div className="profit-dialog__field">
              <label htmlFor="gross-revenue">
                Gross Revenue
              </label>

              <div className="profit-dialog__input-wrap">
                <IndianRupee size={17} />

                <input
                  id="gross-revenue"
                  type="number"
                  name="grossRevenue"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.grossRevenue}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="profit-dialog__field">
              <label htmlFor="net-revenue">
                Net Revenue
              </label>

              <div className="profit-dialog__input-wrap">
                <IndianRupee size={17} />

                <input
                  id="net-revenue"
                  type="number"
                  value={netRevenue}
                  placeholder="Calculated automatically"
                  readOnly
                  aria-readonly="true"
                />
              </div>

              <small>
                Automatically calculated: Gross Revenue − Operational Cost.
              </small>
            </div>
          </div>

          {/* Operational Costs */}
          <div className="profit-dialog__section">
            <h3>Operational Costs</h3>

            <div className="profit-dialog__field">
              <label htmlFor="operational-cost">
                Total Operational Cost
              </label>

              <div className="profit-dialog__input-wrap">
                <IndianRupee size={17} />

                <input
                  id="operational-cost"
                  type="number"
                  name="operationalCost"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.operationalCost}
                  onChange={handleChange}
                  required
                />
              </div>

              <small>
                Barber payments, service costs, commissions, etc.
              </small>
            </div>
          </div>

          {/* Marketing Costs */}
          <div className="profit-dialog__section">
            <h3>Marketing Costs</h3>

            <div className="profit-dialog__field">
              <label htmlFor="marketing-cost">
                Marketing Cost
              </label>

              <div className="profit-dialog__input-wrap">
                <Megaphone size={17} />

                <input
                  id="marketing-cost"
                  type="number"
                  name="marketingCost"
                  placeholder="Enter marketing cost"
                  min="0"
                  step="0.01"
                  value={formData.marketingCost}
                  onChange={handleChange}
                  required
                />
              </div>

              <small>
                Enter your marketing and advertising expenses manually.
              </small>
            </div>
          </div>

          {/* Net Profit Preview */}
          <div className="profit-dialog__section">
            <h3>Profit Summary</h3>

            <div className="profit-dialog__field">
              <label htmlFor="net-profit">
                Net Profit
              </label>

              <div className="profit-dialog__input-wrap">
                <IndianRupee size={17} />

                <input
                  id="net-profit"
                  type="number"
                  value={netProfit}
                  placeholder="Calculated automatically"
                  readOnly
                  aria-readonly="true"
                />
              </div>

              <small>
                Net Revenue − Marketing Cost.
              </small>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="profit-dialog__error"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="profit-dialog__footer">
            <button
              type="button"
              className="profit-dialog__cancel"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="profit-dialog__submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfitDialog;
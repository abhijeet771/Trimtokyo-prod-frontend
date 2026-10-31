import { useEffect, useState } from "react";
import { X, Package, Plus } from "lucide-react";
import "./InventoryDialog.scss";

const INITIAL_FORM = {
  name: "",
  category: "",
  price: "",
  quantity: "",
  shop: "",
};

const INVENTORY_CATEGORIES = [
  "Hair Care",
  "Styling Products",
  "Hair Color",
  "Tools & Accessories",
  "Consumables",
  "Other",
];

const InventoryDialog = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const price = Number(formData.price) || 0;
  const quantity = Number(formData.quantity) || 0;
  const total = price * quantity;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim()) return;
    if (!formData.category) return;
    if (!formData.price || price <= 0) return;
    if (!formData.quantity || quantity <= 0) return;

    const inventoryData = {
      name: formData.name.trim(),
      category: formData.category,
      price,
      quantity,
      shop: formData.shop.trim() || undefined,
      total,
    };

    onSave?.(inventoryData);
    setFormData(INITIAL_FORM);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="inventory-dialog__overlay"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="inventory-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inventory-dialog-title"
      >
        {/* HEADER */}
        <div className="inventory-dialog__header">
          <div className="inventory-dialog__heading">
            <div className="inventory-dialog__icon">
              <Package size={22} />
            </div>

            <div>
              <h2 id="inventory-dialog-title">
                Add Inventory
              </h2>
              <p>
                Add a new inventory expense item.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inventory-dialog__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={21} />
          </button>
        </div>

        {/* FORM */}
        <form
          className="inventory-dialog__form"
          onSubmit={handleSubmit}
        >
          <div className="inventory-dialog__body">

            {/* ITEM NAME */}
            <div className="inventory-dialog__field">
              <label htmlFor="inventory-name">
                Item Name <span>*</span>
              </label>

              <input
                id="inventory-name"
                type="text"
                name="name"
                placeholder="e.g. Shampoo, Hair Wax, Blades"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* CATEGORY */}
            <div className="inventory-dialog__field">
              <label htmlFor="inventory-category">
                Category <span>*</span>
              </label>

              <select
                id="inventory-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select category
                </option>

                {INVENTORY_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* PRICE AND QUANTITY */}
            <div className="inventory-dialog__row">

              <div className="inventory-dialog__field">
                <label htmlFor="inventory-price">
                  Price per Unit (₹) <span>*</span>
                </label>

                <input
                  id="inventory-price"
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  min="0.01"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="inventory-dialog__field">
                <label htmlFor="inventory-quantity">
                  Quantity <span>*</span>
                </label>

                <input
                  id="inventory-quantity"
                  type="number"
                  name="quantity"
                  placeholder="Enter quantity"
                  min="1"
                  step="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* SHOP / SUPPLIER */}
            <div className="inventory-dialog__field">
              <label htmlFor="inventory-shop">
                Shop / Supplier
                <span className="optional">(Optional)</span>
              </label>

              <input
                id="inventory-shop"
                type="text"
                name="shop"
                placeholder="Enter shop or supplier name"
                value={formData.shop}
                onChange={handleChange}
              />
            </div>

            {/* TOTAL */}
            <div className="inventory-dialog__total">
              <div>
                <span>Total Amount</span>
                <small>
                  ₹{price.toLocaleString("en-IN")} × {quantity || 0}
                </small>
              </div>

              <strong>
                ₹{total.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </div>

          </div>

          {/* FOOTER */}
          <div className="inventory-dialog__footer">
            <button
              type="button"
              className="inventory-dialog__cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inventory-dialog__submit"
            >
              <Plus size={18} />
              Add Inventory
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default InventoryDialog;

import { useMemo, useState } from "react";
import { Package, IndianRupee, Boxes, Plus, ChevronLeft, ChevronRight, Store,} from "lucide-react";

import "./InventorySection.scss";

import InventoryDialog from "../../../components/barber/InventoryDialog/InventoryDialog";
import { INVENTORY_DATA, INVENTORY_ITEMS_PER_PAGE,} from "../../../constants/inventory";

const formatCurrency = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

const InventorySection = () => {
  const [inventory, setInventory] = useState(INVENTORY_DATA);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDialog, setShowDialog] = useState(false);

  // KPI CALCULATIONS
  const totalExpense = useMemo(
    () =>
      inventory.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0
      ),
    [inventory]
  );

  const totalProducts = inventory.length;

  const totalQuantity = useMemo(
    () =>
      inventory.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      ),
    [inventory]
  );

  // PAGINATION
  const totalPages = Math.ceil(
    inventory.length / INVENTORY_ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * INVENTORY_ITEMS_PER_PAGE;

  const currentItems = inventory.slice(
    startIndex,
    startIndex + INVENTORY_ITEMS_PER_PAGE
  );

  // ADD INVENTORY
  const handleAddInventory = (data) => {
    const newItem = {
      ...data,
      id: `INV${Date.now()}`,
    };

    setInventory((prev) => [newItem, ...prev]);
    setCurrentPage(1);
    setShowDialog(false);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, totalPages)
    );
  };

  const getCategoryClass = (category) => {
    const categoryClasses = {
      "Hair Care": "hair-care",
      "Styling Products": "styling",
      "Hair Color": "hair-color",
      "Tools & Accessories": "tools",
      Consumables: "consumables",
      Other: "other",
    };

    return categoryClasses[category] || "other";
  };

  return (
    <section className="inventory-section">

      {/* HEADER */}
      <div className="inventory-section__header">
        <div>
          <h2>Inventory Expenses</h2>
          <p>
            Track your salon products, supplies and inventory purchases.
          </p>
        </div>

        <button
          type="button"
          className="inventory-section__add-btn"
          onClick={() => setShowDialog(true)}
        >
          <Plus size={19} />
          Add Inventory
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="inventory-section__kpis">

        <div className="inventory-kpi inventory-kpi--green">
          <div className="inventory-kpi__icon">
            <IndianRupee size={23} />
          </div>

          <div className="inventory-kpi__content">
            <span>Total Inventory Expense</span>
            <h3>{formatCurrency(totalExpense)}</h3>
            <p>Total purchase amount</p>
          </div>
        </div>

        <div className="inventory-kpi inventory-kpi--blue">
          <div className="inventory-kpi__icon">
            <Package size={23} />
          </div>

          <div className="inventory-kpi__content">
            <span>Total Products</span>
            <h3>{totalProducts}</h3>
            <p>Inventory records</p>
          </div>
        </div>

        <div className="inventory-kpi inventory-kpi--orange">
          <div className="inventory-kpi__icon">
            <Boxes size={23} />
          </div>

          <div className="inventory-kpi__content">
            <span>Total Quantity</span>
            <h3>{totalQuantity}</h3>
            <p>Total purchased units</p>
          </div>
        </div>

      </div>

      {/* INVENTORY TABLE */}
      <div className="inventory-section__table-card">

        <div className="inventory-section__table-header">
          <div>
            <h3>Inventory Records</h3>
            <p>
              Manage your inventory purchase history.
            </p>
          </div>

          <span className="inventory-section__record-count">
            {totalProducts} Records
          </span>
        </div>

        <div className="inventory-section__table-wrapper">
          <table className="inventory-section__table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Shop / Supplier</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id}>

                    <td>
                      <div className="inventory-section__item-name">
                        <div className="inventory-section__item-icon">
                          <Package size={17} />
                        </div>

                        <span>{item.name}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`inventory-section__category inventory-section__category--${getCategoryClass(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    </td>

                    <td>
                      {formatCurrency(item.price)}
                    </td>

                    <td>
                      <span className="inventory-section__quantity">
                        {item.quantity}
                      </span>
                    </td>

                    <td>
                      <div className="inventory-section__shop">
                        {item.shop ? (
                          <>
                            <Store size={15} />
                            <span>{item.shop}</span>
                          </>
                        ) : (
                          <span className="inventory-section__empty">
                            —
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <strong className="inventory-section__total">
                        {formatCurrency(item.total)}
                      </strong>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="inventory-section__empty-state"
                  >
                    No inventory records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="inventory-section__pagination">

          <span>
            Showing{" "}
            {inventory.length === 0 ? 0 : startIndex + 1}
            {" - "}
            {Math.min(
              startIndex + INVENTORY_ITEMS_PER_PAGE,
              inventory.length
            )}
            {" "}of {inventory.length} records
          </span>

          <div className="inventory-section__pagination-controls">

            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                type="button"
                key={page}
                className={
                  currentPage === page ? "active" : ""
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={handleNext}
              disabled={
                currentPage === totalPages || totalPages === 0
              }
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>

          </div>
        </div>

      </div>

      {/* ADD INVENTORY DIALOG */}
      <InventoryDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSave={handleAddInventory}
      />

    </section>
  );
};

export default InventorySection;

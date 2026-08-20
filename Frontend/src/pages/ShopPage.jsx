import { useState } from "react";

import Shopheader from "../sections/Shopheader/Shopheader";
import ShopFilterSection from "../sections/ShopFilterSection/ShopFilterSection";
import BookingSection from "../sections/BookingSection/BookingSection";
import MainFooterSection from "../sections/MainFooterSection/MainFooterSection";

const ShopPage = () => {
  /* =========================
     GLOBAL FILTER STATE
  ========================= */

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");

  return (
    <>
      {/* ================= HEADER ================= */}
      <Shopheader />

      {/* ================= MAIN CONTENT ================= */}
      <section className="shop-page-content">

        {/* FILTER SIDEBAR */}
        <ShopFilterSection />

        {/* BOOKINGS / CARDS */}
        <BookingSection
          search={search}
          city={city}
          sort={sort}
          filter={filter}
        />

      </section>

      {/* ================= FOOTER ================= */}
      <MainFooterSection />
    </>
  );
};

export default ShopPage;
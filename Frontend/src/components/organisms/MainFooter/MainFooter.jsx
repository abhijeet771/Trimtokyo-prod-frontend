// src/components/organisms/MainFooter/MainFooter.jsx

import { Link } from "react-router-dom";

import FooterColumn from "../../molecules/FooterColumn/FooterColumn";

import { MAIN_FOOTER_CONTENT } from "../../../constants/footer";

import "./MainFooter.scss";

const MainFooter = () => {
  const {
    brand,
    columns,
    socials,
    legalLinks,
    copyright,
  } = MAIN_FOOTER_CONTENT;

  return (
    <footer className="main-footer">
      <div className="main-footer__container">

        {/* =========================
            TOP SECTION
        ========================== */}
        <div className="main-footer__columns">

          {/* BRAND */}
          <div className="main-footer__brand">

            <div className="main-footer__brand-top">

              <img
                src="/scissor.png"
                alt="TrimTokyo"
                className="main-footer__logo"
              />

              <h3 className="main-footer__brand-name">
                {brand.name}
              </h3>

            </div>

            <p className="main-footer__brand-description">
              {brand.description}
            </p>

            {/* SOCIALS */}
            <div className="main-footer__social-icons">

              {socials.map(
                ({
                  label,
                  href,
                  Icon,
                }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="main-footer__social-link"
                  >
                    <Icon />
                  </a>
                )
              )}

            </div>

          </div>

          {/* FOOTER COLUMNS */}
          {columns.map(
            (column, index) => (
              <FooterColumn
                key={index}
                title={column.title}
                links={column.links}
              />
            )
          )}

        </div>

        {/* =========================
            BOTTOM BAR
        ========================== */}
        <div className="main-footer__bottom">

          <p className="main-footer__copy">
            {copyright}
          </p>

          <div className="main-footer__legal-links">

            {legalLinks.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="main-footer__legal-link"
              >
                {item.label}
              </Link>
            ))}

          </div>

        </div>

      </div>
    </footer>
  );
};

export default MainFooter;
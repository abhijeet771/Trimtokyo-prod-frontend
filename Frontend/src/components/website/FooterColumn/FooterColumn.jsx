
import { Link } from "react-router-dom";
import "./FooterColumn.scss";

const FooterColumn = ({ title, links }) => {
  return (
    <div className="footer-column">
      <h4 className="footer-column__title">
        {title}
      </h4>

      <div className="footer-column__links">
        {links.map((link, index) => {
          const isExternal = link.href?.startsWith("http");

          return isExternal ? (
            <a
              key={link.href || index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-column__link"
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href || index}
              to={link.href || "/"}
              className="footer-column__link"
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FooterColumn;

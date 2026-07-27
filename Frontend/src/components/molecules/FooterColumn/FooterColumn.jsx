import NavLink from "../../atoms/Navlink/Navlink";
import "./FooterColumn.scss";

const FooterColumn = ({ title, links }) => {
  return (
    <div className="footer-column">
      <h4 className="footer-column__title">
        {title}
      </h4>

      <div className="footer-column__links">
        {links.map((link, index) => (
          <NavLink
            key={index}
            href={link.href}
            label={link.label}
            className="footer-column__link"
          />
        ))}
      </div>
    </div>
  );
};

export default FooterColumn;
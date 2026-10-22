
import { Link } from "react-router-dom";
import Icon from "../../atoms/Icon/Icon";
import "./NavItem.scss";

const NavItem = ({
  label,
  iconType,
  active = false,
  onClick,
  variant = "default",
  href = "/",
}) => {
  return (
    <Link
      to={href}
      className={`nav-item nav-item--${variant} ${
        active ? "nav-item--active" : ""
      }`}
      onClick={onClick}
    >
      {iconType && <Icon type={iconType} variant={variant} />}
      <span className="nav-item__label">{label}</span>
    </Link>
  );
};

export default NavItem;

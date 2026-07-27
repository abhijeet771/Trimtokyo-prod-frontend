import "./Icon.scss";
import { FaClipboardList, FaUserTie, FaHome } from "react-icons/fa";

const Icon = ({ type }) => {
  const iconMap = {
    service: <FaClipboardList />,
    barber: <FaUserTie />,
    home: <FaHome />,
  };

  return <div className="icon">{iconMap[type]}</div>;
};

export default Icon;
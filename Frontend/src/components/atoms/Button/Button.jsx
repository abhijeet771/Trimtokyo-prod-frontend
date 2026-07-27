import "./Button.scss";

const Button = ({ children, variant = "primary", onClick }) => {
  return (
    <button
      className={`btn btn--${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
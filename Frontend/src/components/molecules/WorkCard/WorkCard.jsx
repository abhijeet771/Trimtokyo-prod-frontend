import "./WorkCard.scss";

const WorkCard = ({ title, description, image }) => {
  return (
    <div className="work-card">
      <div className="work-card__image">
        <img src={image} alt={title} />
      </div>

      <h3 className="work-card__title">{title}</h3>
      <p className="work-card__description">{description}</p>
    </div>
  );
};

export default WorkCard;
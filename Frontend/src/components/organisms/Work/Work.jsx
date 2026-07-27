import "./Work.scss";
import WorkCard from "../../molecules/WorkCard/WorkCard";
import { WORK_CONTENT } from "../../../constants/work";

const Work = () => {
  const { title, steps } = WORK_CONTENT;

  return (
    <section className="work">
      <div className="work__container">

        <div className="work__header">
          <span className="work__line"></span>
          <h2 className="work__title">{title}</h2>
          <span className="work__line"></span>
        </div>

        <div className="work__grid">
          {steps.map((step) => (
            <WorkCard
              key={step.id}
              title={step.title}
              description={step.description}
              image={step.image}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Work;
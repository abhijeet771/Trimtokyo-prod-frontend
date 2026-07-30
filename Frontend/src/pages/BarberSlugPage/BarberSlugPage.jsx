import SlugHeroSection from "../sections/SlugHeroSection";
import SlugGallerySection from "../sections/SlugGallerySection";
import SlugServicesSection from "../sections/SlugServicesSection";
import SlugTeamSection from "../sections/SlugTeamSection";
import SlugTimingSection from "../sections/SlugTimingSection";
import SlugMapSection from "../sections/SlugMapSection";
import SlugReviewsSection from "../sections/SlugReviewsSection";

import "./BarberSlugPage.scss";

const BarberSlugPage = () => {
  return (
    <main className="barber-slug-page">
      <SlugHeroSection />

      <SlugGallerySection />

      <SlugServicesSection />

      <SlugTeamSection />

      <SlugTimingSection />

      <SlugMapSection />

      <SlugReviewsSection />
    </main>
  );
};

export default BarberSlugPage;
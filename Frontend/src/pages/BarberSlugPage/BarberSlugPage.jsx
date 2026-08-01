import { useParams } from "react-router-dom";

import useGetPublicBarberCms from "../../hooks/useGetPublicBarberCms";

//import SlugHeaderSection from "../sections/SlugHeaderSection"
import SlugHeroSection from "../sections/SlugHeroSection";
import SlugGallerySection from "../sections/SlugGallerySection";
import SlugServicesSection from "../sections/SlugServicesSection";
import SlugTeamSection from "../sections/SlugTeamSection";
import SlugTimingSection from "../sections/SlugTimingSection";
import SlugMapSection from "../sections/SlugMapSection";
import SlugReviewsSection from "../sections/SlugReviewsSection";

import "./BarberSlugPage.scss";

const BarberSlugPage = () => {
  const { slug } = useParams();

  const {
    data,
    isLoading,
    error,
  } = useGetPublicBarberCms(slug);

  const cms = data?.data;

  if (isLoading) {
    return (
      <main className="barber-slug-page">
        Loading...
      </main>
    );
  }

  if (error) {
    return (
      <main className="barber-slug-page">
        Something went wrong.
      </main>
    );
  }
console.log({
  slug,
  data,
  isLoading,
  error,
});

  return (
    <main className="barber-slug-page">
      <SlugHeroSection
        details={cms?.details}
        images={cms?.images}
        others={cms?.others}
      />

      <SlugGallerySection
        images={cms?.images}
      />

      <SlugServicesSection
        services={cms?.services}
      />

      <SlugTeamSection
        barbers={cms?.barbers}
      />

      <SlugTimingSection
        details={cms?.details}
      />

      <SlugMapSection
        details={cms?.details}
        others={cms?.others}
      />

      <SlugReviewsSection />
    </main>
  );
};

export default BarberSlugPage;
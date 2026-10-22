import { useParams } from "react-router-dom";

import useBarberShop from "../../hooks/barber/useBarberShop";
import HeaderSection from "../../sections/User/Shopheader/Shopheader";
import SlugHeroSection from "../sections/SlugHeroSection";
import SlugServicesSection from "../sections/SlugServicesSection";
import SlugGallerySection from "../sections/SlugGallerySection";
import SlugTeamSection from "../sections/SlugTeamSection";
import SlugTimingSection from "../sections/SlugTimingSection";
import SlugMapSection from "../sections/SlugMapSection";
import SlugReviewsSection from "../sections/SlugReviewsSection";

import "./BarberSlugPage.scss";

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  if (typeof value === "object") {
    return getId(value._id ?? value.id);
  }

  return "";
};

const BarberSlugPage = () => {
  const { slug } = useParams();

  const {
    profile,
    gallery,
    services,
    team,
    reviews,
    loading,
    error,
  } = useBarberShop(slug);

  if (loading) {
    return (
      <main className="barber-slug-page">
        Loading salon details...
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="barber-slug-page">
        {error || "Barber shop not found."}
      </main>
    );
  }

  // BarberProfile MongoDB document ID.
  const barberProfileId = getId(
    profile._id ?? profile.id
  );

  // Auth user ID associated with the BarberProfile.
  // These fields must actually contain the Auth user ID.
  const barberUserId = getId(
    profile.userId ??
      profile.user?._id ??
      profile.user?.id ??
      profile.authUserId ??
      profile.barberUserId
  );

  const coordinates = profile.location?.coordinates;

  const latitude = coordinates?.[1] ?? null;
  const longitude = coordinates?.[0] ?? null;

  console.log("[BarberSlugPage] IDs:", {
    salonSlug: profile.slug || slug,
    barberProfileId,
    barberUserId,
    rawUserId: profile.userId,
    rawUser: profile.user,
    rawAuthUserId: profile.authUserId,
    rawBarberUserId: profile.barberUserId,
  });

  const details = {
    ...profile,
    rating: profile.avgRating ?? 0,
    reviews: profile.totalReviews ?? 0,
    latitude,
    longitude,
    mapEmbedUrl: profile.googleMapLink ?? "",
  };

  const images = gallery.length
    ? gallery
    : profile.profileImage
      ? [profile.profileImage]
      : [];

  return (
    <main className="barber-slug-page">
      <HeaderSection />

      <SlugHeroSection
        details={details}
        images={images}
        others={profile}
      />

      <SlugServicesSection
        services={services}
        salonSlug={profile.slug || slug}
        salonName={profile.shopName || "Selected salon"}
        barberProfileId={barberProfileId}
        barberUserId={barberUserId}
        barberLocation={{
          lat: latitude,
          lng: longitude,
        }}
      />

      <SlugGallerySection images={images} />

      <SlugTeamSection barbers={team} />

      <SlugTimingSection
        openingTime={profile.openingTime}
        closingTime={profile.closingTime}
        workingHours={profile.workingHours}
        isOpen={profile.isOpen}
      />

      <SlugMapSection
        address={profile.address}
        city={profile.city}
        state={profile.state}
        postalCode={profile.postalCode}
        phone={profile.phone}
        latitude={details.latitude}
        longitude={details.longitude}
        mapUrl={details.mapEmbedUrl}
      />

      <SlugReviewsSection
        reviews={reviews.items}
        averageRating={
          reviews.summary?.avgRating ??
          profile.avgRating ??
          0
        }
        totalReviews={
          reviews.summary?.totalReviews ??
          profile.totalReviews ??
          0
        }
      />
    </main>
  );
};

export default BarberSlugPage;

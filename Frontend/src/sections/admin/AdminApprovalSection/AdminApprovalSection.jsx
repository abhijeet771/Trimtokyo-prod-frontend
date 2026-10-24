import { useMemo, useState } from "react";
import {  CheckCircle2,  Clock3,  Scissors,  Search,  ShieldCheck,  Star,  Users,  XCircle,  ArrowUpRight,  MapPin,} from "lucide-react";

import useAdminApprovals from "../../../hooks/admin/useAdminApprovals";
import useAdminServiceApprovals from "../../../hooks/admin/useAdminServiceApprovals";

import ApprovalCard from "../../../components/admin/ApprovalCard/ApprovalCard";
import ServiceApprovalCard from "../../../components/admin/ServiceApprovalCard/ServiceApprovalCard";

import "./AdminApprovalSection.scss";

const AdminApprovalSection = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [searchTerm, setSearchTerm] = useState("");

  // Barber approval hook
  const { approvals = [],
    loading: barberLoading,
    error: barberError,
    approveBarber,
    declineBarber,
    toggleFeatureBarber,
    refresh: refreshBarbers,
  } = useAdminApprovals();

  // Service approval hook
  const { services: pendingServices = [],
    loading: serviceLoading,
    error: serviceError,
    approve: approveService,
    reject: rejectService,
    refresh: refreshServices,
  } = useAdminServiceApprovals();

  const loading = activeTab === "service" ? serviceLoading : barberLoading;
  const error = activeTab === "service" ? serviceError : barberError;
  const refresh = activeTab === "service" ? refreshServices : refreshBarbers;

  const pendingBarbers = approvals.filter( (barber) => barber.status === "PENDING");
  const approvedBarbers = approvals.filter((barber) => barber.status === "APPROVED");
  const featuredBarbers = approvedBarbers.filter((barber) => barber.isFeatured);
  const visibleBarbers = useMemo(() => { const query = searchTerm.trim().toLowerCase();

  const source = activeTab === "profile" ? pendingBarbers : activeTab === "featured"
          ? approvedBarbers : [];

    if (!query) return source;

    return source.filter((barber) =>
      [barber.shopName, barber.city, barber.phone,barber.description, barber.userId?.name,]
        .filter(Boolean).some((value) =>String(value).toLowerCase().includes(query)
        )
    );
  }, [activeTab, searchTerm, approvals]);

  const visibleServices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return pendingServices;

    return pendingServices.filter((service) =>
      [ service.title, service.description, service.gender,
        service.barberProfileId?.shopName,
        service.barberProfileId?.city,
      ]
        .filter(Boolean)
        .some((value) =>String(value).toLowerCase().includes(query)
        )
    );
  }, [pendingServices, searchTerm]);

  const tabs = [
    {
      id: "profile",
      label: "Profile Approvals",
      icon: Users,
      count: pendingBarbers.length,
    },
    {
      id: "service",
      label: "Service Approvals",
      icon: Scissors,
      count: pendingServices.length,
    },
    {
      id: "featured",
      label: "Featured Barbers",
      icon: Star,
      count: featuredBarbers.length,
    },
  ];

  const pageDetails = {
    profile: {
      eyebrow: "BARBER MANAGEMENT",
      title: "Pending Barber Approvals",
      description: "Review barber profiles before they go live on TrimTokyo.",
      searchPlaceholder: "Search by shop, owner, city or phone...",
      emptyTitle: "All caught up!",
      emptyDescription: "There are no pending barber profiles to review.",
      emptyIcon: CheckCircle2,
    },
    service: {
      eyebrow: "SERVICE MANAGEMENT",
      title: "Pending Service Approvals",
      description: "Review service details before making them available to customers.",
      searchPlaceholder: "Search services, shops or cities...",
      emptyTitle: "No pending services",
      emptyDescription: "All service submissions have been reviewed.",
      emptyIcon: Scissors,
    },
    featured: {
      eyebrow: "HOMEPAGE MANAGEMENT",
      title: "Featured Homepage Barbers",
      description: "Choose which approved barbers should be highlighted on the homepage.",
      searchPlaceholder: "Search approved barbers...",
      emptyTitle: "No approved barbers found",
      emptyDescription: "Approved barber profiles will appear here.",
      emptyIcon: Star,
    },
  };

  const currentPage = pageDetails[activeTab];
  const EmptyIcon = currentPage.emptyIcon;

  const currentCount =
    activeTab === "profile" ? visibleBarbers.length : activeTab === "service"
        ? visibleServices.length
        : visibleBarbers.length;

  const hasResults = currentCount > 0;

  const handleTabChange = (tab) => { setActiveTab(tab); setSearchTerm("");  };

  if (loading) {
    return (
      <section className="admin-approval-section">
        <div className="approval-loading">
          <div className="approval-loading__spinner" />
          <h3>Loading approvals</h3>
          <p>Fetching approval data...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-approval-section">
      <header className="approval-hero">
        <div className="approval-hero__content">
          <span className="approval-hero__eyebrow">
            TRIMTOKYO ADMIN PANEL
          </span>
          <h1>Approvals &amp; Management</h1>
          <p>
            Review barber profiles, approve services, and manage your
            homepage highlights.
          </p>
        </div>

        <div className="approval-hero__art" aria-hidden="true">
          <div className="approval-hero__circle approval-hero__circle--one" />
          <div className="approval-hero__circle approval-hero__circle--two" />

          <div className="approval-hero__illustration">
            <ShieldCheck size={66} strokeWidth={1.6} />
          </div>
          <div className="approval-hero__spark approval-hero__spark--one">
            ✦
          </div>

          <div className="approval-hero__spark approval-hero__spark--two">
            ✧
          </div>
        </div>
      </header>

      <div className="approval-stats">
        <button
          type="button"
          className={`approval-stat approval-stat--purple ${
            activeTab === "profile" ? "is-selected" : ""
          }`}
          onClick={() => handleTabChange("profile")}>
          <span className="approval-stat__icon">
            <Users size={23} />
          </span>

          <span className="approval-stat__body">
            <span className="approval-stat__label">
              Barber Profiles
            </span>
            <span className="approval-stat__description">
              Pending reviews
            </span>
            <strong>{pendingBarbers.length}</strong>
          </span>

          <span className="approval-stat__arrow">
            <ArrowUpRight size={19} />
          </span>
        </button>

        <button
          type="button"
          className={`approval-stat approval-stat--orange ${activeTab === "service" ? "is-selected" : ""}`}onClick={() => handleTabChange("service")}>
          <span className="approval-stat__icon">
            <Scissors size={23} />
          </span>

          <span className="approval-stat__body">
            <span className="approval-stat__label">
              Service Approvals
            </span>
            <span className="approval-stat__description">
              Pending services
            </span>
            <strong>{pendingServices.length}</strong>
          </span>

          <span className="approval-stat__arrow">
            <ArrowUpRight size={19} />
          </span>
        </button>

        <button
          type="button"
          className={`approval-stat approval-stat--blue ${activeTab === "featured" ? "is-selected" : ""}`}
          onClick={() => handleTabChange("featured")}>
          <span className="approval-stat__icon">
            <Star size={23} />
          </span>

          <span className="approval-stat__body">
            <span className="approval-stat__label">
              Featured Barbers
            </span>
            <span className="approval-stat__description">
              On the homepage
            </span>
            <strong>{featuredBarbers.length}</strong>
          </span>
          <span className="approval-stat__arrow">
            <ArrowUpRight size={19} />
          </span>
        </button>
      </div>

      <nav className="approval-tabs" aria-label="Approval categories">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            type="button"
            className={`approval-tabs__button ${ activeTab === id ? "active" : ""}`}
            onClick={() => handleTabChange(id)}
            aria-current={activeTab === id ? "page" : undefined}>
            <Icon size={19} />
            <span>{label}</span>
            <span className="approval-tabs__count">{count}</span>
          </button>
        ))}
      </nav>

      {error && (
        <div className="approval-error" role="alert">
          <XCircle size={20} />
          <span>{error}</span>
          <button type="button" onClick={() => refresh().catch(() => {})}>
            Try again
          </button>
        </div>
      )}

      <div className="approval-section-heading">
        <div className="approval-section-heading__text">
          <span className={`approval-section-heading__eyebrow approval-section-heading__eyebrow--${activeTab}`}>
            {currentPage.eyebrow}
          </span>

          <h2>{currentPage.title}</h2>
          <p>{currentPage.description}</p>
        </div>

        <span className="approval-results-count">
          <Clock3 size={16} />
          {currentCount} {currentCount === 1 ? "result" : "results"}
        </span>
      </div>

      <div className="approval-toolbar">
        <label className="approval-search">
          <Search size={19} />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={currentPage.searchPlaceholder}
            aria-label={currentPage.searchPlaceholder}
          />

          {searchTerm && (
            <button
              type="button"
              className="approval-search__clear"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search">
              <XCircle size={17} />
            </button>
          )}
        </label>

        <div className="approval-toolbar__hint">
          <MapPin size={16} />
          <span>All locations</span>
        </div>
      </div>

      {!hasResults ? (
        <div className="approval-empty">
          <div className={`approval-empty__icon approval-empty__icon--${activeTab}`}>
            <EmptyIcon size={30} />
          </div>

          <h3>
            {searchTerm ? "No matching results" : currentPage.emptyTitle}
          </h3>

          <p>
            {searchTerm ? "Try another search term to find what you are looking for." : currentPage.emptyDescription}
          </p>

          {searchTerm && (
            <button type="button" className="approval-empty__button" onClick={() => setSearchTerm("")}>
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className={`approval-list approval-list--${activeTab}`}>
          {activeTab === "profile" &&
            visibleBarbers.map((barber) => (
              <ApprovalCard
                key={barber._id}
                barber={barber}
                onApprove={approveBarber}
                onDecline={declineBarber}
              />
            ))}

          {activeTab === "service" &&
            visibleServices.map((service) => (
              <ServiceApprovalCard
                key={service._id}
                service={service}
                onApprove={approveService}
                onReject={rejectService}
              />
            ))}

          {activeTab === "featured" &&
            visibleBarbers.map((barber) => (
              <ApprovalCard
                key={barber._id}
                barber={barber}
                onApprove={approveBarber}
                onDecline={declineBarber}
                onToggleFeature={toggleFeatureBarber}
              />
            ))}
        </div>
      )}
    </section>
  );
};

export default AdminApprovalSection;

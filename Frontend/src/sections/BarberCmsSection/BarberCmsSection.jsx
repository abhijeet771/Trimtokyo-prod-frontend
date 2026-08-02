import { useState } from "react";

import {
  Images,
  Building2,
  Scissors,
  Users,
  Settings2,
} from "lucide-react";

import useGetBarberCms from "../../hooks/useGetBarberCms";
import useGetBarberServicesCms from "../../hooks/useGetBarberServicesCms";
import useCreateBarberCms from "../../hooks/useCreateBarberCms";

import CmsImages from "./tabs/CmsImages";
import CmsDetails from "./tabs/CmsDetails";
import CmsServices from "./tabs/CmsServices";
import CmsBarbers from "./tabs/CmsBarbers";
import CmsOthers from "./tabs/CmsOthers";

import "./BarberCmsSection.scss";

const TABS = [
  {
    id: "images",
    label: "Images",
    icon: Images,
  },
  {
    id: "details",
    label: "Details",
    icon: Building2,
  },
  {
    id: "services",
    label: "Services",
    icon: Scissors,
  },
  {
    id: "barbers",
    label: "Barbers",
    icon: Users,
  },
  {
    id: "others",
    label: "Others",
    icon: Settings2,
  },
];

const BarberCmsSection = () => {
  const [activeTab, setActiveTab] =
    useState("images");

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetBarberCms();

  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useGetBarberServicesCms();

  const {
    mutate: createCms,
    isPending: creatingCms,
  } = useCreateBarberCms();

  const cms = data?.data;
console.log({
  isLoading,
  servicesLoading,
  error,
  status: error?.response?.status,
  data,
});
  const allServices =
    servicesData?.data || [];

  const renderContent = () => {
    switch (activeTab) {
      case "images":
        return (
          <CmsImages
            cms={cms}
            refetch={refetch}
          />
        );

      case "details":
        return (
          <CmsDetails
            cms={cms}
            refetch={refetch}
          />
        );

      case "services":
        return (
          <CmsServices
            cms={cms}
            allServices={allServices}
            refetch={refetch}
          />
        );

      case "barbers":
        return (
          <CmsBarbers
            cms={cms}
            refetch={refetch}
          />
        );

      case "others":
        return (
          <CmsOthers
            cms={cms}
            refetch={refetch}
          />
        );

      default:
        return (
          <CmsImages
            cms={cms}
            refetch={refetch}
          />
        );
    }
  };

  if (
    isLoading ||
    servicesLoading
  ) {
    return (
      <section className="barber-cms-section">
        Loading...
      </section>
    );
  }

  if (servicesError) {
    return (
      <section className="barber-cms-section">
        Failed to load services.
      </section>
    );
  }

  if (
    error?.response?.status === 404
  ) {
    return (
      <section className="barber-cms-section">
        <div className="page-header">
          <div>
            <h2>Brand Website CMS</h2>

            <p>
              Your website has not been
              created yet.
            </p>
          </div>
        </div>

        <div className="cms-empty-state">
          <h3>
            Create Your Brand Website
          </h3>

          <p>
            Click the button below to
            generate your website CMS.
            After that you'll be able
            to manage images, services,
            barbers and other website
            content.
          </p>

          <button
            className="create-cms-btn"
            disabled={creatingCms}
            onClick={() =>
              createCms(undefined, {
                onSuccess: () => {
                  refetch();
                },
              })
            }
          >
            {creatingCms
              ? "Creating..."
              : "Create Website"}
          </button>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="barber-cms-section">
        Failed to load CMS.
      </section>
    );
  }

  return (
    <section className="barber-cms-section">
      <div className="page-header">
        <div>
          <h2>Brand Website CMS</h2>

          <p>
            Customize how your salon
            appears on the customer
            website.
          </p>
        </div>
      </div>

      <div className="cms-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              className={
                activeTab === tab.id
                  ? "tab-btn active"
                  : "tab-btn"
              }
              onClick={() =>
                setActiveTab(tab.id)
              }
            >
              <Icon size={18} />

              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="cms-content">
        {renderContent()}
      </div>
    </section>
  );
};

export default BarberCmsSection;
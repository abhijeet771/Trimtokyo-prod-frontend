# biz-service-brand-site
This repository contains the code for a business service brand website, designed to showcase products, services, and key information. Features include a responsive design, service showcase, brand story, contact forms, and SEO optimization for better visibility in search engines.

# HeaderSection

The HeaderSection renders the top navigation area of the application.
It provides branding, primary navigation links, and key call-to-action buttons while maintaining a consistent and responsive layout across the site.

Responsibilities

- Display application branding
- Render main navigation menu
- Expose primary call-to-action actions
- Maintain responsive header layout

Composition

HeaderSection
 └── Header
     ├── Logo
     ├── NavMenu
     │    └── NavLink
     └── Button
     
**Key Components Used**

Header – Organism responsible for overall header layout and responsiveness
NavMenu – Molecule that groups and manages navigation links
Logo – Atom for brand identity
NavLink – Atom used for navigation routing
Button – Atom for call-to-action buttons

## HeroSection

The `HeroSection` represents the primary above-the-fold area of the landing page.
It communicates the core value proposition and drives initial user engagement through concise messaging and call-to-action elements.


**Responsibilities**
- Highlight the main product message
- Display key statistics or highlights
- Present primary call-to-action buttons

**Composition**
HeroSection
└── Hero
├── HeroText
├── HeroStats
└── HeroCTAs

### Hero Components

**HeroText**  - Displays the main headline and short description that communicate the core value proposition of the product.
**HeroStats** - Shows key metrics or highlights (e.g. users, features, performance) to build credibility and quick trust.
**HeroCTAs**  - Renders primary call-to-action buttons that guide users toward important actions such as getting started or signing up.

## FooterSection

The `FooterSection` displays a simple company branding area containing partner or client logos. 
It is used to showcase trusted companies without additional content or interactions.

**Description**
- Renders a static row/grid of company SVG logos
- Used for brand credibility and visual balance
- No navigation or interactive elements

**Structure**
FooterSection
└── SVG company logos (6)

## FeaturesSection

The `FeaturesSection` highlights the key features or capabilities of the product in a structured and visually consistent layout.

**Description**
- Presents core product features
- Uses cards or grid-based layout for clarity
- Designed for quick scanning and understanding

**Composition**
FeaturesSection
└── FeatureGrid
└── FeatureCard

### Feature Components
**FeatureGrid**  -Arranges multiple features in a responsive grid layout, ensuring consistent spacing and alignment across different screen sizes.
**FeatureCard**  - Represents a single feature item, typically containing an icon, title, and short description to clearly explain a specific capability.

## WorkingSection

The `WorkingSection` explains the step-by-step workflow of how the product or service operates, making the process easy to understand at a glance.
**Description**
- Breaks down the workflow into clear steps
- Uses visual icons and short descriptions
- Designed to improve user understanding of the process

**Composition**
WorkingSection
└── WorkingFlow
└── WorkingCard
├── StepIcon
└── Text

Deployment Link : https://dist-six-kohl.vercel.app/

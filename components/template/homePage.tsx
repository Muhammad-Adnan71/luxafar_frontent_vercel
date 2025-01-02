import { getDictionary } from "@utils/dictionary";
import About from "@template-components/about";
import Collection from "@template-components/collection";
import Contact from "@template-components/contact";
import Faqs from "@template-components/faqs";
import Inspirations from "@template-components/inspirations";
import Partners from "@template-components/partners";
import Testimonials from "@template-components/testimonials";
import Banner from "@template-components/banner";
import React from "react";
import { i18n } from "i18n.config";

async function HomePage({
  banners,
  partners,
  page,
  faqs,
  testimonials,
  inspirations,
  locale = i18n.defaultLocale,
}: {
  locale?: any;
  banners: any;
  partners: any;
  page: any;
  faqs: any;
  testimonials: any;
  inspirations: any;
}) {
  const {
    placeholder,
    button,
    sectionHeadings,
    errors,
    successModal,
    dropdown,
  } = await getDictionary(locale);
  const about = page.content?.find(
    (content: any) => content.name === "about us"
  );
  const partnersData = page.content?.find(
    (content: any) => content.name === "partners"
  );
  const ourStory = page.content?.filter(
    (content: any) => content.name === "our story"
  );
  const inspirationData = page.content?.find(
    (content: any) => content.name === "journey"
  );
  const faqsData = page.content?.find(
    (content: any) => content.name === "faqs"
  );
  const contactData = page.content?.find(
    (content: any) => content.name === "contact"
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Luxafar Re-defining Luxury",
    image: "https://luxafar.com/template/logo.png",
    "@id": "https://luxafar.com",
    url: "https://luxafar.com",
    telephone: "+442034682356",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    email: "contact@luxafar.com",
    description: "",
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.2085919,
      longitude: 55.2765573,
    },
    sameAs: [
      "https://www.facebook.com/luxafarofficial",
      "https://www.instagram.com/luxafar",
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Banner locale={locale} slides={banners} />
      <About locale={locale} viewMore={button.viewMore} data={about} />
      <Collection data={ourStory} />
      <Partners partners={partners} data={partnersData} />
      <Inspirations
        data={inspirationData}
        locale={locale}
        inspirations={inspirations}
        dictionary={{ readMore: button.readMore }}
      />
      <Testimonials
        clientLove={sectionHeadings.testimonialClientLove}
        testimonials={testimonials}
      />
      <Faqs faqs={faqs} data={faqsData} locale={locale} />
      <Contact
        locale={locale}
        dictionary={{ placeholder, button, errors, successModal, dropdown }}
        data={contactData}
      />
    </>
  );
}

export default HomePage;

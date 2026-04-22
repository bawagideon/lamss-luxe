import React from 'react';

export function JsonLd() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "Lamssé Luxe",
    "description": "Leading fashion clothes, affordable women's clothing, and community for queens.",
    "url": "https://www.lamsseluxe.ca",
    "telephone": "+18000000000",
    "email": "info@lamsseluxe.ca",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "7, Exmouth street",
      "addressLocality": "St. John’s",
      "addressRegion": "NL",
      "postalCode": "A1B 2E1",
      "addressCountry": "CA"
    },
    "sameAs": [
      "https://instagram.com/lamsseluxe.ca"
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.lamsseluxe.ca/shop?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}

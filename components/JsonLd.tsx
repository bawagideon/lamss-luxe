import React from 'react';

export function JsonLd() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "Luxe Network",
    "description": "Leading fashion clothes, affordable women's clothing, and community for queens.",
    "url": "https://www.luxenetwork.ca",
    "telephone": "+18000000000",
    "email": "luxenetwork@gmail.com",
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
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}

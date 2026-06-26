const fs = require('fs');
const path = 'd:/PROGRAMARE/Axiobyte/index.html';

let html = fs.readFileSync(path, 'utf8');

// 1. Meta Tags Update
html = html.replace(
  '<title>Axiobyte® | Next-Gen Tech & Design Studio</title>',
  '<title>Axiobyte® | High-End B2B Tech & Design Studio</title>'
);

html = html.replace(
  '<meta\n      name="description"\n      content="Axiobyte® Studio is a high-end creative agency in Bucharest specializing in Brand Strategy, UI/UX Design, Web Experiences, and Native App Development."\n    />',
  '<meta\n      name="description"\n      content="Axiobyte® Studio engineers premium digital experiences for enterprise. We build scalable B2B tech and high-end design systems that drive revenue."\n    />'
);

html = html.replace(
  '<meta\n      name="keywords"\n      content="tech studio, design agency Bucharest, UI/UX design, native app development, brand strategy, brutalist web design, Axiobyte Studio"\n    />',
  '<meta\n      name="keywords"\n      content="b2b tech studio, enterprise design agency Bucharest, high-end UI/UX design, scalable native app development, enterprise brand strategy, Axiobyte Studio"\n    />'
);

html = html.replace(
  '<meta\n      property="og:title"\n      content="Axiobyte® | Next-Gen Tech & Design Studio"\n    />',
  '<meta\n      property="og:title"\n      content="Axiobyte® | High-End B2B Tech & Design Studio"\n    />'
);

html = html.replace(
  '<meta\n      property="og:description"\n      content="We craft digital experiences that shape memorable brands. High-end design & performance from Bucharest."\n    />',
  '<meta\n      property="og:description"\n      content="Axiobyte® Studio engineers premium digital experiences for enterprise. Scalable tech and high-end design from Bucharest."\n    />'
);

html = html.replace(
  '<meta\n      name="twitter:title"\n      content="Axiobyte® | Next-Gen Tech & Design Studio"\n    />',
  '<meta\n      name="twitter:title"\n      content="Axiobyte® | High-End B2B Tech & Design Studio"\n    />'
);

html = html.replace(
  '<meta\n      name="twitter:description"\n      content="We craft digital experiences that shape memorable brands. High-end design & performance."\n    />',
  '<meta\n      name="twitter:description"\n      content="Axiobyte® Studio engineers premium digital experiences for enterprise. Scalable tech and high-end design from Bucharest."\n    />'
);

// 2. JSON-LD Structured Data Injection
const jsonLd = `
    <!-- AEO & SEO Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ProfessionalService",
          "@id": "https://axiobyte.online/#organization",
          "name": "Axiobyte Studio",
          "url": "https://axiobyte.online/",
          "logo": "https://axiobyte.online/assets/logos-axiobyteITsolution/square-axiobyteITsolution.png",
          "image": "https://axiobyte.online/assets/marketing-ads-photos/axiobyte-preview.png",
          "description": "Axiobyte® Studio engineers premium digital experiences for enterprise. We build scalable B2B tech and high-end design systems that drive revenue.",
          "telephone": "+40700000000",
          "email": "contact@axiobyte.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Bucharest",
            "addressCountry": "RO"
          },
          "priceRange": "$$$$",
          "founder": {
            "@id": "https://axiobyte.online/#founder"
          },
          "sameAs": [
            "https://linkedin.com/company/axiobyte",
            "https://twitter.com/axiobyte"
          ]
        },
        {
          "@type": "Person",
          "@id": "https://axiobyte.online/#founder",
          "name": "Alexandru M.",
          "jobTitle": "Creative Director & Co-Founder",
          "worksFor": {
            "@id": "https://axiobyte.online/#organization"
          },
          "sameAs": [
            "https://linkedin.com/in/alexandru-m",
            "https://twitter.com/alexandru-m"
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://axiobyte.online/#website",
          "url": "https://axiobyte.online/",
          "name": "Axiobyte® Studio",
          "publisher": {
            "@id": "https://axiobyte.online/#organization"
          }
        },
        {
          "@type": "FAQPage",
          "@id": "https://axiobyte.online/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What services does Axiobyte Studio offer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Axiobyte Studio provides high-end B2B services including Brand Strategy, Visual Identity, Web Experiences (React, Next.js), and Native App Development (Swift, Kotlin, React Native)."
              }
            },
            {
              "@type": "Question",
              "name": "What is the typical pricing and budget for Axiobyte projects?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We specialize in enterprise and high-growth startup solutions, with engagements typically starting at 10,000 EUR for full digital transformation and architectural rebuilds."
              }
            },
            {
              "@type": "Question",
              "name": "Where is Axiobyte Studio located?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Axiobyte Studio is headquartered in Bucharest, Romania, but partners with global B2B clients and enterprises."
              }
            }
          ]
        }
      ]
    }
    </script>
`;

if (!html.includes('application/ld+json')) {
  html = html.replace('</head>', jsonLd + '</head>');
}

// 3. Semantic H1 Update
const oldH1 = `<h1>
            <span class="title-line1">AXIOBYTE®</span>
            <span class="title-line2">STUDIO</span>
          </h1>`;
const newH1 = `<h1>
            <span class="sr-only">High-End B2B Tech & Design Studio - </span>
            <span class="title-line1" aria-hidden="true">AXIOBYTE®</span>
            <span class="title-line2" aria-hidden="true">STUDIO</span>
          </h1>`;
html = html.replace(oldH1, newH1);

// 4. Alt texts & Aria labels
// Nav Links
html = html.replace('<a href="#services"><span>Services</span></a>', '<a href="#services" aria-label="View our services"><span>Services</span></a>');
html = html.replace('<a href="#case-studies"><span>Work</span></a>', '<a href="#case-studies" aria-label="View our work portfolio"><span>Work</span></a>');
html = html.replace('<a href="#process"><span>Process</span></a>', '<a href="#process" aria-label="View our workflow process"><span>Process</span></a>');

html = html.replace('<a href="#contact-sales" class="btn-session">Request a session</a>', '<a href="#contact-sales" class="btn-session" aria-label="Request a strategy session">Request a session</a>');

html = html.replace('<a href="#contact-sales" data-text="Contact us"', '<a href="#contact-sales" data-text="Contact us" aria-label="Contact us"');

html = html.replace('<a href="#" class="btn-case-study">→ VIEW CASE STUDY</a>', '<a href="#" class="btn-case-study" aria-label="View full case study details">→ VIEW CASE STUDY</a>');

// Avatars Aria Labels
html = html.replace('class="avatar-item active" data-index="0"', 'class="avatar-item active" data-index="0" role="button" aria-label="View testimonial from Andrei Florescu" tabindex="0"');
html = html.replace('class="avatar-item" data-index="1"', 'class="avatar-item" data-index="1" role="button" aria-label="View testimonial from Marcus Vance" tabindex="0"');
html = html.replace('class="avatar-item" data-index="2"', 'class="avatar-item" data-index="2" role="button" aria-label="View testimonial from Elena Rostova" tabindex="0"');
html = html.replace('class="avatar-item" data-index="3"', 'class="avatar-item" data-index="3" role="button" aria-label="View testimonial from Victor M." tabindex="0"');

// Form Aria
html = html.replace('<form action="" class="sales-form" id="axiobyte-lead-form">', '<form action="" class="sales-form" id="axiobyte-lead-form" aria-label="Contact Sales Form">');

fs.writeFileSync(path, html);
console.log('SEO update successful.');

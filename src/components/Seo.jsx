import { Helmet } from "react-helmet-async";
import { SITE_URL } from "../../site.config.js";

const DOMAIN = SITE_URL;
// Interim OG image = existing /propic.jpeg. Replace with a 1200x630 /og-image.png
// (see reportSEOstatus.md "Missing assets").
const DEFAULT_IMAGE = `${DOMAIN}/propic.jpeg`;

export default function Seo({
    title,
    description,
    path = "/",
    image = DEFAULT_IMAGE,
    breadcrumb = null, // array of { name, item }
}) {
    const url = `${DOMAIN}${path}`;
    const fullTitle = title.includes("Alessandro Carella")
        ? title
        : `${title} — Alessandro Carella`;
    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {breadcrumb && (
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: breadcrumb.map((b, i) => ({
                            "@type": "ListItem",
                            position: i + 1,
                            name: b.name,
                            item: b.item,
                        })),
                    })}
                </script>
            )}
        </Helmet>
    );
}

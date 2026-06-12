import { Helmet } from "react-helmet-async";
import { SITE_URL } from "../../site.config.js";

const DOMAIN = SITE_URL;
// 1200x630 social card generated at build by scripts/gen-og-image.mjs.
const DEFAULT_IMAGE = `${DOMAIN}/og-image.png`;

export default function Seo({
    title,
    description,
    path = "/",
    image = DEFAULT_IMAGE,
    breadcrumb = null, // array of { name, item }
    jsonLd = null, // extra schema.org node (e.g. CreativeWork per project)
}) {
    // Cloudflare Pages serves every route at a trailing slash and 308-redirects
    // the bare form (/home -> /home/), so canonical + og:url must name the
    // trailing-slash URL — otherwise they point at a redirect. Root "/" stays.
    const normalizedPath = path.endsWith("/") ? path : `${path}/`;
    const url = `${DOMAIN}${normalizedPath}`;
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
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={fullTitle} />

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

            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
}

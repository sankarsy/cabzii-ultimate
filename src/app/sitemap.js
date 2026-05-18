export default function sitemap() {
  const base = "https://cabzii.in";
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/cabs`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/packages`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/drivers`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/booking`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/signin`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/admin`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/terms-and-conditions`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/legal-declaration`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/cancellation-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 }
  ];
}

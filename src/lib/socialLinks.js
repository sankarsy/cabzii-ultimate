/** Official Cabzii social profiles — used in footer, schema sameAs, etc. */
export const SOCIAL_LINKS = {
  instagram: {
    label: "Instagram",
    handle: "@cabzii.in",
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/cabzii.in/"
  },
  facebook: {
    label: "Facebook",
    handle: "cabzii.in",
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/cabzii.in/"
  }
};

export const SOCIAL_LINK_LIST = [SOCIAL_LINKS.instagram, SOCIAL_LINKS.facebook];

/**
 * Central customer-stat config.
 *
 * Repo values conflict (50K+ / 10K+ / 500+ / 150+ / 4.9 vs zero placeholders)
 * and none are backed by live booking or review data. Do not pick a number.
 * Public UI must not display customer, trip, driver, city, or rating counts
 * until business confirms a source.
 */
export const SITE_STATS = {
  happyCustomers: null,
  tripsCompleted: null,
  verifiedDrivers: null,
  citiesCovered: null,
  rating: null
};

export const SITE_STATS_UNRESOLVED = true;

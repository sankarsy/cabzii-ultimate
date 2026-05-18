import styles from "./home.module.css";

const cabs = [
  { category: "Economy Sedan", vendor: "SwiftRide", price: "₹1,099", discountPercentage: 18, availability: "18 Cabs Available" },
  { category: "Premium SUV", vendor: "Urban Wheels", price: "₹1,899", discountPercentage: 22, availability: "7 Cabs Available" },
  { category: "XL Family Van", vendor: "Highway Partner", price: "₹2,499", discountPercentage: 15, availability: "Limited: 3 Left" }
];

export default function CabSlider() {
  return (
    <section className={styles.section} id="cabs">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Cab Category, Price & Availability</h2>
        <p className={styles.sectionSub}>
          Compare vehicles from multiple vendors with transparent fares.
        </p>
        <div className={styles.grid3}>
          {cabs.map((cab) => (
            <article key={cab.category} className={styles.card}>
              <span className={styles.discountBadge}>{cab.discountPercentage}% OFF</span>
              <h3>{cab.category}</h3>
              <p>Vendor: {cab.vendor}</p>
              <div className={styles.price}>{cab.price}</div>
              <p className={cab.availability.includes("Limited") ? styles.limited : styles.available}>
                {cab.availability}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

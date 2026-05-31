import styles from "./home.module.css";

const packages = [
  { name: "Shimla & Manali", vendor: "Mountain Trails", price: "₹12,499 onwards" },
  { name: "Goa Beach Escape", vendor: "Sunset Holidays", price: "₹9,999 onwards" },
  { name: "Rajasthan Royal Route", vendor: "Desert Quest", price: "₹16,999 onwards" }
];

export default function TourSection() {
  return (
    <section className={styles.section} id="packages">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Travel Packages & Price</h2>
        <p className={styles.sectionSub}>Curated packages from top-rated travel vendors. Toll, permit & driver bata extra.</p>
        <div className={styles.grid3}>
          {packages.map((item) => (
            <article key={item.name} className={styles.card}>
              <h3>{item.name}</h3>
              <p>By {item.vendor}</p>
              <div className={styles.price}>{item.price}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

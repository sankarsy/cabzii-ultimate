import styles from "./home.module.css";

const packages = [
  { name: "Shimla & Manali", vendor: "Mountain Trails", duration: "4N/5D", price: "₹12,499 / person" },
  { name: "Goa Beach Escape", vendor: "Sunset Holidays", duration: "3N/4D", price: "₹9,999 / person" },
  { name: "Rajasthan Royal Route", vendor: "Desert Quest", duration: "5N/6D", price: "₹16,999 / person" }
];

export default function TourSection() {
  return (
    <section className={styles.section} id="packages">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Travel Packages & Price</h2>
        <p className={styles.sectionSub}>Curated packages from top-rated travel vendors.</p>
        <div className={styles.grid3}>
          {packages.map((item) => (
            <article key={item.name} className={styles.card}>
              <h3>{item.name}</h3>
              <p>{item.duration}</p>
              <p>By {item.vendor}</p>
              <div className={styles.price}>{item.price}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
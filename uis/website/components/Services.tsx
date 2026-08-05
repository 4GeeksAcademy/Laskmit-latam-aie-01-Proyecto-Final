import type { ServiceItem } from "./types";
import styles from "../app/page.module.css";

type ServicesProps = {
  items: ServiceItem[];
};

export function Services({ items }: ServicesProps) {
  return (
    <section id="servicios" className={styles.section}>
      <div className={styles.container}>
        <p className={styles.sectionEyebrow}>Servicios</p>
        <h2 className={styles.sectionTitle}>
          Soluciones especializadas para cada etapa del talento
        </h2>
        <div className={styles.cardGridThree}>
          {items.map((service) => (
            <article className={styles.infoCard} key={service.title}>
              <h3>{service.title}</h3>
              <ul>
                {service.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

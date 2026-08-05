import type { HighlightItem } from "./types";
import styles from "../app/page.module.css";

type WhyNexovaProps = {
  items: HighlightItem[];
};

export function WhyNexova({ items }: WhyNexovaProps) {
  return (
    <section id="por-que-nexova" className={styles.sectionAlt}>
      <div className={styles.container}>
        <p className={styles.sectionEyebrow}>Por que Nexova</p>
        <h2 className={styles.sectionTitle}>Experiencia y resultados para escalar equipos</h2>
        <div className={styles.cardGridTwo}>
          {items.map((item) => (
            <article className={styles.highlightCard} key={item.text}>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

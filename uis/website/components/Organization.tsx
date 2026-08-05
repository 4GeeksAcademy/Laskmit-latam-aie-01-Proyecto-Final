import type { DepartmentItem } from "./types";
import styles from "../app/page.module.css";

type OrganizationProps = {
  core: DepartmentItem[];
  support: DepartmentItem[];
};

export function Organization({ core, support }: OrganizationProps) {
  return (
    <section id="organizacion" className={styles.section}>
      <div className={styles.container}>
        <p className={styles.sectionEyebrow}>Nuestra organizacion</p>
        <h2 className={styles.sectionTitle}>
          Una estructura integral para atraer, desarrollar y potenciar talento
        </h2>
        <p className={styles.sectionLead}>
          Nexova tiene una red profunda de candidatos y clientes construida en doce anos,
          con un equipo que sabe encontrar, desarrollar y acompanar talento.
        </p>

        <article className={styles.executiveCard}>
          <p>Direccion y estrategia</p>
          <h3>Direccion Ejecutiva</h3>
          <span>
            Define la estrategia general de Nexova y asegura alineacion entre operaciones,
            crecimiento y experiencia del cliente.
          </span>
        </article>

        <div className={styles.groupBlock}>
          <h3>Departamentos principales</h3>
          <div className={styles.cardGridThree}>
            {core.map((department) => (
              <article className={styles.infoCard} key={department.title}>
                <h4>{department.title}</h4>
                <p>{department.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.groupBlock}>
          <h3>Procesos de soporte transversal</h3>
          <div className={styles.cardGridTwo}>
            {support.map((department) => (
              <article className={styles.infoCard} key={department.title}>
                <h4>{department.title}</h4>
                <p>{department.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

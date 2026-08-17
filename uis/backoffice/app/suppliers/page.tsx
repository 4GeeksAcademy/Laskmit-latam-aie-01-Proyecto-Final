import styles from "./suppliers.module.css";
import { SuppliersPageClient } from "./suppliers-page-client";

export default function SuppliersPage() {
  // Página contenedora: copy principal + componente cliente con toda la interacción.
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.kicker}>Compras y Operaciones</p>
          <h1>Directorio de Proveedores</h1>
          <p>
            Registro oficial de proveedores de Nexova con filtros por pais y categoria, alta de nuevos
            proveedores, actualizacion de tarifa mensual y control de estado activo/suspendido.
          </p>
        </header>

        <SuppliersPageClient />
      </div>
    </div>
  );
}

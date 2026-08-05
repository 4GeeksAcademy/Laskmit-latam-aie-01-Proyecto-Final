import type { ContactItem } from "./types";
import styles from "../app/page.module.css";

type ContactFooterProps = {
  contacts: ContactItem[];
};

export function ContactFooter({ contacts }: ContactFooterProps) {
  return (
    <footer id="contacto" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div>
            <h2>Contacto</h2>
            <ul className={styles.contactList}>
              {contacts.map((contact) => (
                <li key={contact.label}>
                  <span>{contact.label}: </span>
                  <a href={contact.href}>{contact.value}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.socialBlock}>
            <h2>Redes</h2>
            <div className={styles.socialLinks}>
              <a href="https://linkedin.com/company/nexova" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href="https://instagram.com/nexova" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </div>
          </div>
        </div>
        <p className={styles.copy}>© 2025 Nexova. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

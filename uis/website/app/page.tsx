import { ContactFooter } from "../components/ContactFooter";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Organization } from "../components/Organization";
import { Services } from "../components/Services";
import { WhyNexova } from "../components/WhyNexova";
import {
  contacts,
  coreDepartments,
  highlights,
  navItems,
  services,
  supportDepartments,
} from "../components/content";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header items={navItems} />
      <main>
        <Hero />
        <Services items={services} />
        <WhyNexova items={highlights} />
        <Organization core={coreDepartments} support={supportDepartments} />
      </main>
      <ContactFooter contacts={contacts} />
    </div>
  );
}

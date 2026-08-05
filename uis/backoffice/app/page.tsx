import styles from "./page.module.css";
import type { Candidate, SelectionProcess, Vacancy } from "../../../src/types/models";
import {
  calculateAverageSalary,
  calculateCandidateScore,
  calculateVacancyFillRate,
  countCandidatesByStatus,
  findTopSkills,
  rankCandidatesForVacancy,
} from "../../../src/utils/transformations";

const candidates: Candidate[] = [
  {
    id: "C-2024-0451",
    fullName: "Maria Gonzalez",
    email: "maria.gonzalez@email.com",
    phone: "+56912345678",
    yearsOfExperience: 5,
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    englishLevel: "B2",
    seniority: "Semi-Senior",
    currentSalary: 3500,
    expectedSalary: 4200,
    availability: "1 month",
    location: "Valencia, Espana",
    remoteOnly: false,
    status: "Active",
  },
  {
    id: "C-2024-0452",
    fullName: "Juan Perez",
    email: "juan.perez@email.com",
    phone: "+56987654321",
    yearsOfExperience: 3,
    skills: ["JavaScript", "React", "CSS", "HTML"],
    englishLevel: "B1",
    seniority: "Junior",
    currentSalary: 2200,
    expectedSalary: 2800,
    availability: "Immediate",
    location: "Miami, Estados Unidos",
    remoteOnly: true,
    status: "Active",
  },
  {
    id: "C-2024-0453",
    fullName: "Carolina Silva",
    email: "carolina.silva@email.com",
    phone: "+56911223344",
    yearsOfExperience: 8,
    skills: ["TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS"],
    englishLevel: "C1",
    seniority: "Senior",
    currentSalary: 5500,
    expectedSalary: 6500,
    availability: "2 weeks",
    location: "Valencia, Espana",
    remoteOnly: false,
    status: "In process",
  },
];

const vacancy: Vacancy = {
  id: "V-2024-0892",
  title: "Senior Full-Stack Developer",
  companyName: "TechCorp Solutions",
  requiredSkills: ["TypeScript", "React", "Node.js"],
  preferredSkills: ["PostgreSQL", "Docker"],
  minYearsExperience: 4,
  maxYearsExperience: 8,
  requiredEnglishLevel: "B2",
  requiredSeniority: "Senior",
  salaryRangeMin: 5000,
  salaryRangeMax: 7000,
  isRemote: true,
  location: "Remote",
  status: "Open",
};

const sampleProcesses: SelectionProcess[] = [
  {
    id: "SP-2024-1523",
    candidateId: "C-2024-0451",
    vacancyId: "V-2024-0892",
    stage: "Screening",
    score: 75,
    notes: "Buen perfil, falta experiencia en Docker.",
    createdAt: new Date("2024-06-01T10:00:00Z"),
    updatedAt: new Date("2024-06-01T10:00:00Z"),
  },
  {
    id: "SP-2024-1524",
    candidateId: "C-2024-0452",
    vacancyId: "V-2024-0892",
    stage: "Hired",
    score: 60,
    notes: "Perfil junior con potencial.",
    createdAt: new Date("2024-06-02T11:00:00Z"),
    updatedAt: new Date("2024-06-02T11:00:00Z"),
  },
  {
    id: "SP-2024-1525",
    candidateId: "C-2024-0453",
    vacancyId: "V-2024-0892",
    stage: "Interview",
    score: 85,
    notes: "Excelente match general.",
    createdAt: new Date("2024-06-03T12:00:00Z"),
    updatedAt: new Date("2024-06-03T12:00:00Z"),
  },
];

export default function Home() {
  const ranked = rankCandidatesForVacancy(candidates, vacancy);
  const statusCount = countCandidatesByStatus(candidates);
  const topSkills = findTopSkills(candidates, 3);
  const avgSalary = calculateAverageSalary(candidates);
  const fillRate = calculateVacancyFillRate(sampleProcesses);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <p className={styles.kicker}>Backoffice Nexova</p>
          <h1>Panel interno de Talent Pipeline</h1>
          <p>
            Esta vista consume la logica de negocio de Hito 2 importada desde
            <strong> src/utils/transformations.ts</strong> sin duplicar codigo.
          </p>
        </header>

        <section className={styles.metricsGrid}>
          <article className={styles.metricCard}>
            <h2>Salario esperado promedio</h2>
            <p>USD {avgSalary.toLocaleString("en-US")}</p>
          </article>
          <article className={styles.metricCard}>
            <h2>Tasa de vacante cubierta</h2>
            <p>{fillRate}%</p>
          </article>
          <article className={styles.metricCard}>
            <h2>Candidatos activos</h2>
            <p>{statusCount.Active}</p>
          </article>
          <article className={styles.metricCard}>
            <h2>En proceso</h2>
            <p>{statusCount["In process"]}</p>
          </article>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Ranking para la vacante: {vacancy.title}</h2>
            <span>{ranked.length} candidatos evaluados</span>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Candidato</th>
                <th>Seniority</th>
                <th>Skills clave</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((item) => (
                <tr key={item.candidate.id}>
                  <td>{item.candidate.fullName}</td>
                  <td>{item.candidate.seniority}</td>
                  <td>{item.candidate.skills.slice(0, 3).join(", ")}</td>
                  <td>{calculateCandidateScore(item.candidate, vacancy)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={styles.panel}>
          <h2>Top habilidades detectadas</h2>
          <ul className={styles.skillList}>
            {topSkills.map((skill) => (
              <li key={skill.skill}>
                <span>{skill.skill}</span>
                <strong>{skill.count}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.panel}>
          <h2>Estado de procesos demo</h2>
          <ul className={styles.processList}>
            {sampleProcesses.map((process) => (
              <li key={process.id}>
                <span>{process.id}</span>
                <span>{process.stage}</span>
                <span>{process.score}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className={styles.note}>
          Integracion validada por importacion directa desde el modulo original de Hito 2.
        </div>
      </main>
    </div>
  );
}

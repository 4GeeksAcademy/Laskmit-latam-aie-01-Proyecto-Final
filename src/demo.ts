import type { Candidate, Vacancy, SelectionProcess } from "./types/models";
import { validateCandidate, validateVacancy } from "./utils/validations";

// Comandos para ejecutar este archivo desde la raiz del proyecto:
// parace que hay que poner primero 
// npm install typescript
// 1) npx tsx src/demo.ts
// 2) npx tsc --noEmit

console.log("Corrida de prueba: Archivo demo.ts para probar Hito 2");

// Datos de prueba para correr el Proyecto

// CANDIDATOS

const sampleCandidates: Candidate[] = [
  {
    id: "C-2024-0451",
    fullName: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+56912345678",
    yearsOfExperience: 5,
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    englishLevel: "B2",
    seniority: "Semi-Senior",
    currentSalary: 3500,
    expectedSalary: 4200,
    availability: "1 month",
    location: "Valencia, España",
    remoteOnly: false,
    status: "Active",
  },
  {
    id: "C-2024-0452",
    fullName: "Juan Pérez",
    email: "juan.perez@email.com",
    phone: "+56987654321",
    yearsOfExperience: 3,
    skills: ["JavaScript", "React", "CSS", "HTML"],
    englishLevel: "B1",
    seniority: "Junior",
    currentSalary: 2200,
    expectedSalary: 2800,
    availability: "Immediate",
    location: "Miami, Florida, Estados Unidos",
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
    location: "Valencia, España",
    remoteOnly: false,
    status: "Active",
  },
];

// Vacante de Ejemplo

const sampleVacancy: Vacancy = {
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

const sampleSelectionProcesses: SelectionProcess[] = [
  {
    id: "SP-2024-1523",
    candidateId: "C-2024-0451",
    vacancyId: "V-2024-0892",
    stage: "Screening",
    score: 75,
    notes: "Buen perfil, pero falta experiencia en Docker.",
    createdAt: new Date("2024-06-01T10:00:00Z"),
    updatedAt: new Date("2024-06-01T10:00:00Z"),
  },
  // agregar a juan perez y carolina silva en diferentes etapas del proceso de selección para la misma vacante
  {
    id: "SP-2024-1524",
    candidateId: "C-2024-0452",
    vacancyId: "V-2024-0892",
    stage: "Hired",
    score: 60,
    notes: "Perfil junior, pero con buena actitud y ganas de aprender.",
    createdAt: new Date("2024-06-02T11:00:00Z"),
    updatedAt: new Date("2024-06-02T11:00:00Z"),
  },
  {
    id: "SP-2024-1525",
    candidateId: "C-2024-0453",
    vacancyId: "V-2024-0892",
    stage: "Interview",
    score: 85,
    notes: "Excelente perfil, cumple con todos los requisitos.",
    createdAt: new Date("2024-06-03T12:00:00Z"),
    updatedAt: new Date("2024-06-03T12:00:00Z"),
  },  
];  

// llamar a las funciones de validacion
// function validateCandidate(candidate: Candidate): {valid: boolean, errors: string[] }
console.log("Validando candidatos de prueba...");
sampleCandidates.forEach(candidate => {
    const validation = validateCandidate(candidate);
    if (validation.valid) {
        console.log(`Candidato ${candidate.fullName} es válido.`);
    } else {
        console.log(`Candidato ${candidate.fullName} tiene errores:`, validation.errors);
    }
});

// function validateVacancy(vacancy: Vacancy): {valid: boolean, errors: string[] }
console.log("\nValidando vacante de prueba...");
const vacancyValidation = validateVacancy(sampleVacancy);
if (vacancyValidation.valid) {
    console.log(`Vacante "${sampleVacancy.title}" es válida.`);
} else {
    console.log(`Vacante "${sampleVacancy.title}" tiene errores:`, vacancyValidation.errors);
}


// prueba para filtrar candidatos por skills
import { filterCandidatesBySkills } from "./utils/collections";

console.log("\nFiltrando candidatos por habilidades requeridas ");
const filteredCandidates = filterCandidatesBySkills(sampleCandidates, ["TypeScript", "Node.js"]);
// Deben salir solamente Maria González y Carolina Silva
console.log("Candidatos filtrados:", filteredCandidates); 

console.log("\nFiltrando candidatos por habilidades requeridas sin enviar las habilidades (ERROR) ");
const filteredCandidatesError = filterCandidatesBySkills(sampleCandidates, []);
// No debe filtrar ningún candidato y debe mostrar un error
console.log("Candidatos filtrados (error):", filteredCandidatesError); 


// prueba para filtrar candidatos por seniority
import { filterCandidatesBySeniority } from "./utils/collections";

console.log("\nFiltrando candidatos por seniority requerido ");
const seniorCandidates = filterCandidatesBySeniority(sampleCandidates, "Senior");
// Debe salir solamente Carolina Silva
console.log("Candidatos filtrados por seniority:", seniorCandidates);

console.log("\nFiltrando candidatos por seniority requerido sin enviar el seniority (ERROR) ");
const seniorCandidatesError = filterCandidatesBySeniority(sampleCandidates, "" as any);
// No debe filtrar ningún candidato y debe mostrar un error
console.log("Candidatos filtrados por seniority (error):", seniorCandidatesError);

// prueba para filtrar candidatos por disponibilidad
import { filterCandidatesByAvailability } from "./utils/collections";

console.log("\nFiltrando candidatos por disponibilidad requerida ");
const availableCandidates = filterCandidatesByAvailability(sampleCandidates, ["Immediate", "1 month"]);
// Deben salir Juan Pérez y María González
console.log("Candidatos filtrados por disponibilidad:", availableCandidates);

console.log("\nFiltrando candidatos por disponibilidad requerida SIN ENVIAR LA DISPONIBILIDAD (ERROR) ");
const availableCandidatesError = filterCandidatesByAvailability(sampleCandidates, [] as any);
// No debe filtrar ningún candidato y debe mostrar un error
console.log("Candidatos filtrados por disponibilidad (error):", availableCandidatesError);

// prueba para ordenar candidatos por salario esperado
import { sortCandidatesBySalary } from "./utils/collections";

console.log("\nOrdenando candidatos por salario esperado (ascendente) ");
const candidatesSortedBySalaryAsc = sortCandidatesBySalary(sampleCandidates, "asc");
// El orden debe ser: Juan Pérez, María González, Carolina Silva
console.log("Candidatos ordenados por salario esperado (asc):", candidatesSortedBySalaryAsc);

console.log("\nOrdenando candidatos por salario esperado (descendente) ");
const candidatesSortedBySalaryDesc = sortCandidatesBySalary(sampleCandidates, "desc");
// El orden debe ser: Carolina Silva, María González, Juan Pérez
console.log("Candidatos ordenados por salario esperado (desc):", candidatesSortedBySalaryDesc);

// prueba para ordenar candidatos por años de experiencia
import { sortCandidatesByExperience } from "./utils/collections";

console.log("\nOrdenando candidatos por años de experiencia (ascendente) ");
const candidatesSortedByExperienceAsc = sortCandidatesByExperience(sampleCandidates, "asc");
// El orden debe ser: Juan Pérez, María González, Carolina Silva
console.log("Candidatos ordenados por años de experiencia (asc):", candidatesSortedByExperienceAsc);  

console.log("\nOrdenando candidatos por años de experiencia (descendente) ");
const candidatesSortedByExperienceDesc = sortCandidatesByExperience(sampleCandidates, "desc");
// El orden debe ser: Carolina Silva, María González, Juan Pérez
console.log("Candidatos ordenados por años de experiencia (desc):", candidatesSortedByExperienceDesc);

// Buscar un candidato por su ID y si lo encuentra

import { findCandidateById } from "./utils/search";
console.log("\nBuscando candidato por ID 'C-2024-0452' ");
const candidateById = findCandidateById(sampleCandidates, "C-2024-0452");
// Debe encontrar a Juan Pérez
console.log("Candidato encontrado por ID:", candidateById);

// Buscar un candidato por su ID y NO LO ENCUENTRA

console.log("\nBuscando candidato por ID 'C-2024-0000' ");
const candidateByIdMalo = findCandidateById(sampleCandidates, "C-2024-0000");
// No debe encontrar a ningún candidato
console.log("Candidato encontrado por ID:", candidateByIdMalo);

// Buscar un candidato por su email

import { findCandidateByEmail } from "./utils/search";
console.log("\nBuscando candidato por email (no lo encuentra) 'maria.gonzalez@example.com' ");
const candidateByEmailMalo = findCandidateByEmail(sampleCandidates, "maria.gonzalez@example.com");
// No debe encontrar a ningún candidato
console.log("Candidato encontrado por email:", candidateByEmailMalo); 

// Buscar un candidato por su email que si está bueno

console.log("\nBuscando candidato por email (si lo encuentra)'maria.gonzalez@email.com' ");
const candidateByEmailBueno  = findCandidateByEmail(sampleCandidates, "maria.gonzalez@email.com");
// Debe encontrar a María González
console.log("Candidato encontrado por email:", candidateByEmailBueno); 

// BUSCAR CANDIDATO por salario esperado usando búsqueda binaria (el array debe estar ordenado por salario esperado)

import { binarySearchCandidateBySalary } from "./utils/search";
console.log("\nBuscando candidato por salario esperado 4200 usando búsqueda binaria (array ordenado por salario ascendente) ");
const indexBySalary = binarySearchCandidateBySalary(candidatesSortedBySalaryAsc, 4200);
// Debe encontrar el índice de María González (que es 1 en el array ordenado por salario ascendente)
console.log("Índice del candidato encontrado por salario esperado:", indexBySalary);    

console.log("\nBuscando candidato por salario esperado 4200 y NO LO ENCUENTRA usando búsqueda binaria (array ordenado por salario ascendente) ");
const indexBySalaryMalo = binarySearchCandidateBySalary(candidatesSortedBySalaryAsc, 9000);
// No debe encontrar a ningún candidato
console.log("Índice del candidato encontrado por salario esperado:", indexBySalaryMalo);    

// Calcular el score de todos los candidatos uno por uno respecto a la vacante de muestra
import { calculateCandidateScore } from "./utils/transformations";
console.log("\nCalculando score de cada candidato respecto a la vacante de muestra ");
sampleCandidates.forEach(candidate => {
    const score = calculateCandidateScore(candidate, sampleVacancy);
    console.log(`Score de ${candidate.fullName} para la vacante "${sampleVacancy.title}":`, score);
});

// Rankear candidatos para la vacante de muestra
import { rankCandidatesForVacancy } from "./utils/transformations";

console.log("\nRankeando candidatos para la vacante de muestra ");
const rankedCandidates = rankCandidatesForVacancy(sampleCandidates, sampleVacancy);
// El orden debe ser: Carolina Silva (score más alto), María González, Juan Pérez (score más bajo)
console.log("Candidatos rankeados para la vacante:", rankedCandidates);

// Agrupar candidatos por seniority
import { groupCandidatesBySeniority } from "./utils/transformations";

console.log("\nAgrupando candidatos por seniority ");
const groupedBySeniority = groupCandidatesBySeniority(sampleCandidates);
// Debe haber 1 candidato en Junior (Juan Pérez), 1 en Semi-Senior (María González) y 1 en Senior (Carolina Silva)
console.log("Candidatos agrupados por seniority:", groupedBySeniority); 

// contar los candidatos por estatus
import { countCandidatesByStatus } from "./utils/transformations";

console.log("\nContando candidatos por estatus ");
const countByStatus = countCandidatesByStatus(sampleCandidates);
// Debe haber 3 candidatos con estatus "Active"
console.log("Conteo de candidatos por estatus:", countByStatus);

// Calcular el salario esperado promedio de los candidatos
import { calculateAverageSalary } from "./utils/transformations";

console.log("\nCalculando salario esperado promedio de los candidatos ");
const averageExpectedSalary = calculateAverageSalary(sampleCandidates);
// El salario esperado promedio debe ser (4200 + 2800 + 6500) / 3 = 4500
console.log("Salario esperado promedio de los candidatos:", averageExpectedSalary); 

// encontrar los top skills más comunes entre los candidatos
import { findTopSkills } from "./utils/transformations";

console.log("\nEncontrando las top 3 habilidades más comunes entre los candidatos ");
const topSkills = findTopSkills(sampleCandidates, 3);
// Las habilidades más comunes deben ser: TypeScript (2), Node.js (2), React (2)
console.log("Top 3 habilidades más comunes entre los candidatos:", topSkills);    

// crear una muestra de procesos de selección para probar la función de rankeo de candidatos por vacante
// Probar calculateVacancyFillRate
import { calculateVacancyFillRate } from "./utils/transformations";

console.log("\nCalculando tasa de llenado de la vacante de muestra ");
const vacancyFillRate = calculateVacancyFillRate(sampleSelectionProcesses);
// La tasa de llenado debe ser 1/3 = 0.3333 ya que hay 1 candidato contratado (Juan Pérez) de los 3 en proceso
console.log("Tasa de llenado de la vacante:", vacancyFillRate);  

console.log("\nProbando validaciones con datos inválidos ");

// Probar findCandidateById con ID vacío
console.log("Buscando candidato por ID vacío:", findCandidateById(sampleCandidates, ""));

// Probar findCandidateByEmail con email vacío
console.log("Buscando candidato por email vacío:", findCandidateByEmail(sampleCandidates, ""));

// Probar binarySearchCandidateBySalary con array vacío
console.log("Buscando candidato por salario en array vacío:", binarySearchCandidateBySalary([], 5000));

// Probar rankCandidatesForVacancy con array vacío
console.log("Rankeando candidatos con array vacío:", rankCandidatesForVacancy([], sampleVacancy));

// Probar groupCandidatesBySeniority con array vacío
console.log("Agrupando candidatos con array vacío:", groupCandidatesBySeniority([]));

// Probar countCandidatesByStatus con array vacío
console.log("Contando candidatos con array vacío:", countCandidatesByStatus([]));

// Probar calculateAverageSalary con array vacío
console.log("Calculando salario promedio con array vacío:", calculateAverageSalary([]));

// Probar findTopSkills con array vacío
console.log("Encontrando top skills con array vacío:", findTopSkills([], 3));

// Probar calculateVacancyFillRate con array vacío
console.log("Calculando tasa de llenado con array vacío:", calculateVacancyFillRate([]));

// COMO ÚLTIMA PRUEBA ALTERAR LOS VALORES EN LOS OBJETOS DE CANDIDATOS Y VACANTES PARA QUE APAREZCAN LOS ERRORES EN VALIDAR CANDIDATO Y VALIDAR VACANTE
console.log("\nProbando validaciones con datos de candidatos y vacantes inválidos ");

// Probar validar candidato con datos inválidos
const invalidCandidate: Candidate = {
    id: "",
    fullName: "",
    email: "invalid-email",
    phone: "12345",
    yearsOfExperience: -1,
    skills: [],
    englishLevel: "Invalid" as any,
    seniority: "Invalid" as any,
    currentSalary: -1000,
    expectedSalary: -2000,
    availability: "Invalid" as any,
    location: "",
    remoteOnly: false,
    status: "Invalid" as any,
};

console.log("Validando candidato con datos inválidos:", validateCandidate(invalidCandidate));

// Probar validar vacante con datos inválidos
const invalidVacancy: Vacancy = {
    id: "",
    title: "",
    companyName: "",
    requiredSkills: [],
    preferredSkills: [],
    minYearsExperience: -1,
    maxYearsExperience: -1,
    requiredEnglishLevel: "Invalid" as any,
    requiredSeniority: "Invalid" as any,
    salaryRangeMin: -1000,
    salaryRangeMax: -2000,
    isRemote: false,
    location: "",
    status: "Invalid" as any,
};

console.log("Validando vacante con datos inválidos:", validateVacancy(invalidVacancy));



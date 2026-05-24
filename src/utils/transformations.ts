import type { Candidate, Vacancy, SeniorityLevel, EnglishLevel, CandidateStatus, SelectionProcess } from "../types/models";
import { filterCandidatesBySkills } from "./collections";

// Funciones de agregacion y reportes simples.
export function calculateCandidateScore(candidate: Candidate, vacancy: Vacancy): number {
    // Calcula un puntaje de match (0-100) entre un candidato y una vacante basado en:
    // verificar que el candidato y la vacante no sean nulos, en ese caso no se debería calcular nada, dar el error y retornar 0
    if (!candidate || !vacancy) {
        console.error("No se puede calcular el puntaje: candidato o vacante no especificados.");
        return 0;
    }

    // Match de habilidades (40 puntos máx):
    // +40 puntos si el candidato tiene TODAS las habilidades requeridas
    // +20 puntos si el candidato tiene al menos 50% de las habilidades requeridas
    // +10 puntos por cada habilidad preferida que tenga el candidato (máx +20)
    let MatchHabilidades = 0;
    const requiredSkills = vacancy.requiredSkills;
    const preferredSkills = vacancy.preferredSkills;

    // Usar funciones ya creadas en collections.ts y search.ts
    // Matching de requeridas (case-insensitive)
    const candidatoTieneTodas = filterCandidatesBySkills([candidate], requiredSkills).length === 1;
    const requiredMatches = requiredSkills.filter(skill =>
        candidate.skills.some(candidateSkill => candidateSkill.toLowerCase() === skill.toLowerCase())).length;
    const preferredMatches = preferredSkills.filter(skill =>
        candidate.skills.some(candidateSkill => candidateSkill.toLowerCase() === skill.toLowerCase())).length;

    if (candidatoTieneTodas) {
        MatchHabilidades += 40;
    } else if (requiredMatches >= requiredSkills.length / 2) {
        MatchHabilidades += 20;
    }

    MatchHabilidades += Math.min(preferredMatches * 10, 20);

    // Match de experiencia (20 puntos máx):
    // +20 puntos si la experiencia del candidato está dentro del rango de la vacante
    // +10 puntos si el candidato está 1-2 años fuera del rango
    // 0 puntos si está más de 2 años fuera del rango
    let MatchExperiencia = 0;
    const minExp = vacancy.minYearsExperience;
    const maxExp = vacancy.maxYearsExperience;
    const candidateExp = candidate.yearsOfExperience;

    if (candidateExp >= minExp && candidateExp <= maxExp) {
        MatchExperiencia += 20;
    } else if ((candidateExp >= minExp - 2 && candidateExp < minExp) || (candidateExp > maxExp && candidateExp <= maxExp + 2)) {
        MatchExperiencia += 10;
    }

    // Match de seniority (15 puntos máx):
    // +15 puntos por match exacto
    // +7 puntos si el candidato está un nivel arriba o abajo
    // 0 puntos en otro caso
    let MatchSeniority = 0;
    const seniorityLevels: SeniorityLevel[] = ["Junior", "Semi-Senior", "Senior", "Lead", "Executive"];
    const vacancySeniorityIndex = seniorityLevels.indexOf(vacancy.requiredSeniority);
    const candidateSeniorityIndex = seniorityLevels.indexOf(candidate.seniority);

    if (candidateSeniorityIndex === vacancySeniorityIndex) {
        MatchSeniority += 15;
    } else if (Math.abs(candidateSeniorityIndex - vacancySeniorityIndex) === 1) {
        MatchSeniority += 7;
    }

    // Match de nivel de inglés (15 puntos máx):
    // +15 puntos si el candidato cumple o excede el nivel requerido
    // 0 puntos en otro caso
    let MatchIngles = 0;
    const vacancyEnglishIndex = vacancy.requiredEnglishLevel;
    const candidateEnglishIndex = candidate.englishLevel;

    if (candidateEnglishIndex >= vacancyEnglishIndex) {
        MatchIngles += 15;
    }

    // Match de salario (10 puntos máx):
    // +10 puntos si el salario esperado del candidato está dentro del rango de la vacante
    // +5 puntos si está hasta 20% por encima del máximo
    // 0 puntos si está más del 20% por encima
    let MatchSalario = 0;
    const minSalary = vacancy.salaryRangeMin;
    const maxSalary = vacancy.salaryRangeMax;
    const candidateSalary = candidate.expectedSalary;

    if (candidateSalary >= minSalary && candidateSalary <= maxSalary) {
        MatchSalario += 10;
    } else if (candidateSalary > maxSalary && candidateSalary <= maxSalary * 1.2) {
        MatchSalario += 5;
    }

    // calcular match total sumando todas las categorias anteriores
    const totalScore = MatchHabilidades + MatchExperiencia + MatchSeniority + MatchIngles + MatchSalario;

    return totalScore;
}

export function rankCandidatesForVacancy(candidates: Candidate[], vacancy: Vacancy): Array<{candidate: Candidate, score: number}> {
    // Puntúa todos los candidatos contra la vacante
    // Los retorna ordenados por puntaje (más alto primero)
    // Cada elemento contiene el candidato y su puntaje
    // verificar que los candidatos no estén vacíos y que la vacante no sea nula, en ese caso no se debería rankear nada, dar el error y retornar un array vacío

    if (!candidates || candidates.length === 0 || !vacancy) {
        console.error("No se puede rankear candidatos: array de candidatos vacío o vacante no especificada.");
        return [];
    }

    // Usar la función calculateCandidateScore para obtener el puntaje de cada candidato
    const scoredCandidates = candidates.map(candidate => ({
        candidate,
        score: calculateCandidateScore(candidate, vacancy)
    }));

    return scoredCandidates.sort((a, b) => b.score - a.score);
}

export function groupCandidatesBySeniority(candidates: Candidate[]): Record<SeniorityLevel, Candidate[]> {
    // Agrupa candidatos por nivel de seniority
    // Retorna un objeto donde las claves son niveles de seniority y los valores son arrays de candidatos
    // verificar que los candidatos no estén vacíos, en ese caso no se debería agrupar nada, dar el error y retornar un objeto con arrays vacíos
    if (!candidates || candidates.length === 0) {
        console.error("No se puede agrupar candidatos: array de candidatos vacío.");
        return {
            Junior: [],
            "Semi-Senior": [],
            Senior: [],
            Lead: [],
            Executive: []
        };
    }
    const grouped: Record<SeniorityLevel, Candidate[]> = {
        Junior: [],
        "Semi-Senior": [],
        Senior: [],
        Lead: [],
        Executive: []
    };

    candidates.forEach(candidate => {
        grouped[candidate.seniority].push(candidate);
    });

    return grouped;
}

export function countCandidatesByStatus(candidates: Candidate[]): Record<CandidateStatus, number> {
    // Retorna un conteo de candidatos para cada estado
    // verificar que los candidatos no estén vacíos, en ese caso no se debería contar nada, dar el error y retornar un objeto con conteos en 0
    if (!candidates || candidates.length === 0) {
        console.error("No se puede contar candidatos: array de candidatos vacío.");
        return {
            Active: 0,
            "In process": 0,
            Hired: 0,
            Inactive: 0
        };
    }

    const statusCount: Record<CandidateStatus, number> = {
        Active: 0,
        "In process": 0,
        Hired: 0,
        Inactive: 0
    };

    candidates.forEach(candidate => {
        statusCount[candidate.status]++;
    });

    return statusCount;
}

export function calculateAverageSalary(candidates: Candidate[]): number {
    // Retorna el salario esperado promedio de todos los candidatos
    // Redondear a 2 decimales
    if (!candidates || candidates.length === 0) {
        console.error("No se puede calcular el salario promedio: array de candidatos vacío.");
        return 0;
    }

    const totalSalary = candidates.reduce((sum, candidate) => sum + candidate.expectedSalary, 0);
    return parseFloat((totalSalary / candidates.length).toFixed(2));
}

export function findTopSkills(candidates: Candidate[], topN: number): Array<{skill: string, count: number}> {
    // Encuentra las N habilidades más comunes entre todos los candidatos
    // Las retorna ordenadas por frecuencia (más alta primero)
    // Cada elemento contiene el nombre de la habilidad y cuántos candidatos la tienen
    if (!candidates || candidates.length === 0) {
        console.error("No se puede encontrar habilidades: array de candidatos vacío.");
        return [];
    }
    const skillCount: Record<string, number> = {};

    candidates.forEach(candidate => {
        candidate.skills.forEach(skill => {
            const skillLower = skill.toLowerCase();
            skillCount[skillLower] = (skillCount[skillLower] || 0) + 1;
        });
    });

    const sortedSkills = Object.entries(skillCount)
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count);

    return sortedSkills.slice(0, topN);
}

export function calculateVacancyFillRate(processes: SelectionProcess[]): number {
    // Calcula qué porcentaje de procesos terminaron en "Hired"
    // Retorna un número entre 0 y 100, redondeado a 2 decimales
    if (!processes || processes.length === 0) {
        console.error("No se puede calcular el porcentaje de vacantes llenadas: array de procesos vacío.");
        return 0;
    }

    const hiredCount = processes.filter(process => process.stage === "Hired").length;
    return parseFloat(((hiredCount / processes.length) * 100).toFixed(2));
}

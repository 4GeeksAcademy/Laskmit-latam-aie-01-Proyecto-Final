import type { Candidate, SeniorityLevel, AvailabilityStatus } from "../types/models";
// Funciones utilitarias para trabajar con arrays.

export function filterCandidatesBySkills(candidates: Candidate[], requiredSkills: string[]): Candidate[] {
// Retorna candidatos que tienen TODAS las habilidades requeridas
// El matching de habilidades debe ser case-insensitive
// every es la condicion de que tenga TODAS las requeridas para ser incluido en el filtro
// some indica que al menos una de las del candidato debe cumplir el filtro, es decir:
// el candidato debe tener todas las requeridas  pero no todas las del candidato deber ser requeridas.
// validar en caso de que los candidatos o los skills estén vacios, en ese caso no se debería filtrar nada, dar el error y retornar el array original
    if (!candidates || candidates.length === 0 || !requiredSkills || requiredSkills.length === 0) {
        console.error("No se puede filtrar candidatos: array de candidatos o habilidades requeridas vacío.");
        return candidates;
    }
    return candidates.filter(candidate =>
        requiredSkills.every(skill =>
            candidate.skills.some(candidateSkill => candidateSkill.toLowerCase() === skill.toLowerCase())
        )
    );
}


export function filterCandidatesBySeniority(candidates: Candidate[], seniority: SeniorityLevel): Candidate[] { 
    // Retorna candidatos con el nivel de seniority especificado
    // El candidato debe tener exactamente el nivel de seniority solicitado
    // validar en caso de que los candidatos estén vacios o no se ha indicado en seniority, en ese caso no se debería filtrar nada, dar el error y retornar el array original 
    if (!candidates || candidates.length === 0 || !seniority) {
        console.error("No se puede filtrar candidatos: array de candidatos vacío o nivel de seniority no especificado.");
        return candidates;
    }
    return candidates.filter(candidate => candidate.seniority === seniority);
}

export function filterCandidatesByAvailability(candidates: Candidate[], availability: AvailabilityStatus[]): Candidate[] {
    // Retorna candidatos cuya disponibilidad coincida con cualquiera de los estados proporcionados
    // Validar si los candidatos están vacíos o si no se ha indicado la disponibilidad, en ese caso no se debería filtrar nada, dar el error y retornar el array original
    if (!candidates || candidates.length === 0 || !availability || availability.length === 0) {
        console.error("No se puede filtrar candidatos: array de candidatos vacío o disponibilidad no especificada.");
        return candidates;
    }
    return candidates.filter(candidate => availability.includes(candidate.availability));
    
}


export function sortCandidatesBySalary(candidates: Candidate[], order: "asc" | "desc"): Candidate[] {
    // Retorna candidatos ordenados por salario esperado (ascendente o descendente)
    // No debe mutar el array original
    // verificar que el arreglo de candidatos no esté vacio, en ese caso no se debería ordenar nada, dar el error y retornar el array original
    if (!candidates || candidates.length === 0) {
        console.error("No se puede ordenar candidatos: array de candidatos vacío.");
        return candidates;
    }   
    return [...candidates].sort((a, b) => {
        if (order === "asc") {
            return a.expectedSalary - b.expectedSalary;
        } else {
            return b.expectedSalary - a.expectedSalary;
        }
    });
}


export function sortCandidatesByExperience(candidates: Candidate[], order: "asc" | "desc"): Candidate[] {
    // Retorna candidatos ordenados por años de experiencia (ascendente o descendente)
    // No debe mutar el array original
    // verificar que el arreglo de candidatos no esté vacio, en ese caso no se debería ordenar nada, dar el error y retornar el array original
    if (!candidates || candidates.length === 0) {
        console.error("No se puede ordenar candidatos: array de candidatos vacío.");
        return candidates;
    }
    return [...candidates].sort((a, b) => {
        if (order === "asc") {
            return a.yearsOfExperience - b.yearsOfExperience;
        } else {
            return b.yearsOfExperience - a.yearsOfExperience;
        }
    });
}


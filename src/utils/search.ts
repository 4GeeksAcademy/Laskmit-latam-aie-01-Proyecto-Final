import type { Candidate } from "../types/models";
// Funciones de busqueda lineal y binaria.

export function findCandidateById(candidates: Candidate[], id: string): Candidate | null {
    // Realiza búsqueda lineal para encontrar un candidato por ID
    // Retorna el candidato si se encuentra, null en caso contrario
    // verificar que los candidatos no estén vacíos y que el id no esté vacío, en ese caso no se debería buscar nada, dar el error y retornar null
    if (!candidates || candidates.length === 0 || !id) {
        console.error("No se puede buscar candidato: array de candidatos vacío o ID no especificado.");
        return null;
    }
    for (const candidate of candidates) {
        if (candidate.id === id) {
            return candidate;
        }
    }
    return null;
}


export function findCandidateByEmail(candidates: Candidate[], email: string): Candidate | null {
    // Realiza búsqueda lineal para encontrar un candidato por email
    // La comparación de email debe ser case-insensitive
    // Retorna el candidato si se encuentra, null en caso contrario
    // verificar que los candidatos no estén vacíos y que el email no esté vacío, en ese caso no se debería buscar nada, dar el error y retornar null
    if (!candidates || candidates.length === 0 || !email) {
        console.error("No se puede buscar candidato: array de candidatos vacío o email no especificado.");
        return null;
    }
    for (const candidate of candidates) {
        if (candidate.email.toLowerCase() === email.toLowerCase()) {
            return candidate;
        }
    }
    return null;
}


export function binarySearchCandidateBySalary(sortedCandidates: Candidate[], targetSalary: number): number {
    // Asume que el array ya está ordenado por salario esperado (ascendente)
    // Realiza búsqueda binaria para encontrar el índice de un candidato con el salario objetivo
    // Retorna el índice si se encuentra, -1 en caso contrario
    // Nota: Si múltiples candidatos tienen el mismo salario, retorna cualquier índice válido

    let left = 0;
    let right = sortedCandidates.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midSalary = sortedCandidates[mid].expectedSalary;

        if (midSalary === targetSalary) {
            return mid;
        } else if (midSalary < targetSalary) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}


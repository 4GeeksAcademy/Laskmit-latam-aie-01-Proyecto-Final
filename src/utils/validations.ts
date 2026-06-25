import type { Candidate, Vacancy } from "../types/models";

// Validaciones requeridas

// VALIDAR DATOS DE CANDIDATO
// Valida todas las reglas de negocio para un candidato
// Retorna un objeto con:
// valid: true si todas las validaciones pasan, false en caso contrario
// errors: array de mensajes de error (vacío si es válido)

export function validateCandidate(candidate: Candidate): {valid: boolean, errors: string[] } {
  // yearsOfExperience debe ser >= 0 y <= 50
  // currentSalary y expectedSalary deben ser > 0
  // El array skills debe contener al menos 1 habilidad
  // email debe ser un formato de email válido (verificación básica: contiene @ y .)
  // phone no debe estar vacío

    const errors: string[] = [];
    if (candidate.yearsOfExperience < 0 || candidate.yearsOfExperience > 50) {  
        errors.push("Años de experiencia debe ser positivo y no mayor a 50");
    }
    if (candidate.currentSalary <= 0) {
        errors.push("Salario actual debe ser mayor a 0");
    }
    if (candidate.expectedSalary <= 0) {
        errors.push("Salario esperado debe ser mayor a 0");
    }

    if (candidate.skills.length === 0) {
        errors.push("Debe indicar al menos una habilidad");
    }
    if (!isValidEmail(candidate.email)) {
        errors.push("Email del candidato no es válido");
    }

    if (candidate.phone.trim() === "") {
        errors.push("Indique el Teléfono del candidato");
    }   

    return {  valid: errors.length === 0, errors };
}

// VALIDAR VACANTES
//  Valida todas las reglas de negocio para una vacante
// Retorna un objeto con:
// valid: true si todas las validaciones pasan, false en caso contrario
// errors: array de mensajes de error (vacío si es válido)

export function validateVacancy(vacancy: Vacancy): {valid: boolean, errors: string[] } {
  // requiredSkills debe contener al menos 1 habilidad
  // minYearsExperience debe ser >= 0
  // maxYearsExperience debe ser >= minYearsExperience
  // salaryRangeMax debe ser >= salaryRangeMin
  // Ambos valores de salario deben ser > 0

    const errors: string[] = [];

    if (vacancy.requiredSkills.length === 0) {
        errors.push("Debe indicar al menos una habilidad para la vacante");
    }
    if (vacancy.minYearsExperience < 0) {
        errors.push("Los años de experiencia mínima deben ser positivos");
    }
    if (vacancy.maxYearsExperience < vacancy.minYearsExperience) {
        errors.push("Los años de experiencia máxima deben ser mayores o iguales a los mínimos");
    }
    if (vacancy.salaryRangeMin <= 0) {
        errors.push("El salario mínimo debe ser mayor a 0");
    }
    if (vacancy.salaryRangeMax <= 0) {
        errors.push("El salario máximo debe ser mayor a 0");
    }
    if (vacancy.salaryRangeMax < vacancy.salaryRangeMin) {
        errors.push("El salario máximo debe ser mayor o igual al mínimo");
    }
    
    return {  valid: errors.length === 0, errors };
}

// VALIDAR LOS CORREOS ELECTRÓNICOS

function isValidEmail(email: string): boolean {
// Retorna true si el email contiene @ y . en posiciones correctas
// Validación muy básica (no es de nivel producción)

    return email.includes("@") && email.includes(".");
}


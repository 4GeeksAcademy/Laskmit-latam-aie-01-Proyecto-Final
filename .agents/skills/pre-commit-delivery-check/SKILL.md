# SKILL: pre-commit-delivery-check

## Objetivo unico
Verificar que un cambio esta listo para commit segun contexto de Nexova, reglas del monorepo y criterios de aceptacion del hito activo.

## Inputs
- `hito`: nombre del hito (ejemplo: `hito-4-ingenieria-ia`).
- `scope`: rutas impactadas.
- `acceptance_criteria`: checklist oficial del hito.
- `commands`: comandos de validacion tecnica por tecnologia.
- `evidence`: rutas de evidencia opcional (capturas, logs, reportes).

## Procedimiento
1. Leer contexto minimo: `memory-bank/projectbrief.md`, `memory-bank/techContext.md`, `memory-bank/progress.md`, `AGENTS.md`, `.agents/rules/*.md`.
2. Confirmar que el scope no rompe estructura ni toca rutas protegidas sin autorizacion.
3. Ejecutar `commands` y recopilar resultados.
4. Evaluar `acceptance_criteria` como `Cumple` o `No cumple`.
5. Verificar reutilizacion de logica (sin copia de modulos existentes).
6. Registrar conclusiones y pendientes en `memory-bank/progress.md`.

## Output esperado
Reporte en Markdown con:
- Resumen de cambios.
- Resultado de comandos.
- Checklist de aceptacion.
- Estado final: `APROBADO` o `RECHAZADO`.

## Criterios de aceptacion verificables
- [ ] Se leyeron los archivos de contexto requeridos.
- [ ] Se ejecutaron todos los comandos definidos en `commands`.
- [ ] Todos los criterios criticos del hito estan en `Cumple`.
- [ ] No hay duplicacion de logica de negocio.
- [ ] `memory-bank/progress.md` fue actualizado con estado y siguientes pasos.

## Regla de salida
Si falla un criterio critico, el estado debe ser `RECHAZADO` y no se recomienda commit.

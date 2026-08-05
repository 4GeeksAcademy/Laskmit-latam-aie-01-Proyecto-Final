# AGENTS.md

## Lectura obligatoria al inicio de cada sesion
1. `CONTEXT-Hito-0-nexova-briefing.es.md`
2. `CONTEXT-Hito-1-web-fundamentals.md`
3. `CONTEXT-Hito-2-fund-programacion-nexova.es.md`
4. `CONTEXT-Hito-3-Talent-Pipeline-Tracker-nexova.es.md`
5. `CONTEXT-Hito-4-ingenieria-ia.md`
6. `memory-bank/projectbrief.md`
7. `memory-bank/techContext.md`
8. `memory-bank/progress.md`
9. `.agents/rules/*.md`

## Flujo obligatorio antes de cada commit
1. Revisar contexto de negocio y contexto tecnico del hito actual en `memory-bank/` y archivos `CONTEXT-*` relevantes.
2. Confirmar alcance de cambios y verificar que no se modifican rutas protegidas sin autorizacion explicita.
3. Ejecutar validaciones del scope afectado (por ejemplo `npm run lint`, `npm run test`, `npm run build` o equivalentes).
4. Verificar criterios de aceptacion del hito contra resultados observables en UI/API.
5. Actualizar `memory-bank/progress.md` con estado real, riesgos y siguientes pasos.
6. Generar resumen de entrega con cambios, evidencia de validacion y pendientes.

## Rutas protegidas
No modificar sin confirmacion explicita del desarrollador:
- `CONTEXT-Hito-*.md`
- `memory-bank/`
- `.agents/`
- `docs/`
- `README.md` y `README.es.md`

## Reglas de integracion
- La logica de negocio existente se reutiliza por importacion desde su origen.
- No copiar/duplicar modulos de negocio para acelerar entregas.
- Cualquier API nueva debe vivir dentro de `services/`.

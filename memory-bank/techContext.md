# Tech Context

## Stack principal
- Frontend: Next.js + TypeScript para `uis/website` y `uis/backoffice`.
- Backend/servicios: Python en `services/`.
- Logica compartida: TypeScript en `src/` y Python utilitario en `shared/`.
- Monorepo con artefactos por hito y documentacion de soporte.

## Decisiones de arquitectura
1. Separar experiencia publica (`uis/website`) de experiencia interna (`uis/backoffice`).
2. Reutilizar modulos existentes por importacion desde origen.
3. Centralizar reglas operativas de agentes en `AGENTS.md` y `.agents/`.
4. Mantener banco de memoria actualizado para cada entrega.

## Restricciones tecnicas
- No crear APIs fuera de `services/`.
- No duplicar codigo de logica de negocio.
- No modificar rutas protegidas sin aprobacion explicita.
- Toda decision nueva debe reflejarse en `memory-bank/progress.md`.

## Riesgos actuales
- Hito 5 (inventario backend) sigue mayormente documentado y no implementado.
- El analizador de incidencias existe pero requiere alineacion continua con la nueva gobernanza.

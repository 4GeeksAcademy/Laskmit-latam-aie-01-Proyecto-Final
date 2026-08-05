# Regla: monorepo-guardrails

## Alcance
Siempre activa.

## Objetivo
Garantizar que cada cambio respete la estructura del monorepo y la gobernanza del proyecto Nexova.

## Reglas
1. UIs y apps web deben vivir en `uis/`.
2. Servicios y APIs deben vivir en `services/`.
3. Configuracion de agentes debe vivir en `.agents/`.
4. Contexto operativo y decisiones vigentes deben actualizarse en `memory-bank/`.
5. Esta prohibido duplicar logica de negocio que ya existe en otra ruta; se debe importar desde origen.
6. Si una tarea requiere tocar rutas protegidas, detener ejecucion y pedir confirmacion del desarrollador.

## Criterio de cumplimiento
- El cambio conserva estructura.
- No hay duplicacion de dominio.
- Existe evidencia de actualizacion en `memory-bank/progress.md`.

# Plan tecnico de implementacion - Hito 5 (Inventario Backend)

## Objetivo
Implementar el backend de inventario de Nexova en `services/` con reglas de negocio verificables, estructura mantenible y trazabilidad completa bajo la gobernanza definida en Hito 4.

## Alcance funcional
1. Gestion de activos (productos) de inventario.
2. Registro de entradas (inbound) y salidas (outbound).
3. Consulta consolidada de ordenes de inventario.
4. Validaciones de stock y reglas de asignacion.

## Estructura objetivo en monorepo
- `services/api/main.py`
- `services/api/database.py`
- `services/api/models.py`
- `services/api/schemas.py`
- `services/api/routers/inventory.py`
- `services/api/tests/test_inventory_endpoints.py`

## API objetivo
1. `GET /inventory/products`
2. `POST /inventory/products`
3. `GET /inventory/products/{id}`
4. `POST /inventory/orders/inbound`
5. `POST /inventory/orders/outbound`
6. `GET /inventory/orders`

## Reglas de negocio obligatorias
1. `current_stock = sum(entries) - sum(exits)`.
2. No permitir salidas con cantidad superior al stock actual.
3. Validar `assigned_to` segun `exit_type`.
4. `user_uuid` debe resolverse desde TinyDB/identidad externa sin tabla SQL de usuarios local.

## Modelo de datos sugerido
### Asset
- `id` (UUID)
- `sku` (string unico)
- `name` (string)
- `category` (string)
- `location` (string)
- `created_at` (datetime)

### AssetEntry
- `id` (UUID)
- `asset_id` (FK Asset)
- `quantity` (int > 0)
- `unit_cost` (decimal >= 0)
- `source` (string)
- `created_at` (datetime)

### AssetExit
- `id` (UUID)
- `asset_id` (FK Asset)
- `quantity` (int > 0)
- `exit_type` (enum: assignment, loss, maintenance, return)
- `assigned_to` (string opcional/condicional)
- `notes` (string opcional)
- `created_at` (datetime)

## Fases de implementacion

### Fase 1 - Base tecnica
1. Crear `database.py` y sesion de persistencia.
2. Crear `models.py` y migraciones iniciales.
3. Crear `schemas.py` con validaciones Pydantic.
4. Conectar router `inventory.py` en `main.py`.

### Fase 2 - Endpoints de productos
1. Implementar `POST /inventory/products`.
2. Implementar `GET /inventory/products` con filtros basicos.
3. Implementar `GET /inventory/products/{id}`.

### Fase 3 - Movimientos de inventario
1. Implementar `POST /inventory/orders/inbound`.
2. Implementar `POST /inventory/orders/outbound` con validacion de stock.
3. Implementar `GET /inventory/orders` con paginacion y filtros por tipo/fecha.

### Fase 4 - Calidad y evidencia
1. Crear pruebas unitarias e integracion de endpoints.
2. Ejecutar validaciones (test, lint, run local).
3. Actualizar `memory-bank/progress.md` con evidencia.
4. Ejecutar skill `pre-commit-delivery-check` antes de commit.

## Criterios de aceptacion verificables
- [ ] Estructura en `services/api/` creada segun plan.
- [ ] Endpoints de inventario responden segun contrato.
- [ ] Reglas de stock y asignacion aplicadas en salidas.
- [ ] Pruebas minimas cubren casos happy path y errores criticos.
- [ ] Evidencia de validacion registrada en `memory-bank/progress.md`.

## Riesgos y mitigaciones
1. Riesgo: sobreventa por race condition de stock.
   Mitigacion: transacciones atomicas y bloqueo logico por asset.
2. Riesgo: datos invalidos en salidas.
   Mitigacion: validaciones de schema + reglas de dominio.
3. Riesgo: deriva de arquitectura fuera de `services/`.
   Mitigacion: aplicar regla `.agents/rules/monorepo-guardrails.md`.

## Dependencias previas
1. Definir estrategia de persistencia actual (SQLite/PostgreSQL).
2. Confirmar libreria ORM y version Python activa en `services/api`.
3. Alinear formato de respuestas con consumidores esperados (backoffice/reportes).

# Propuesta de Arquitectura de Backend

## 1) Contexto y objetivo

En la aplicación solicitada, el backend debe resolver tareas específicas (por ejemplo, stock neto por entradas y salidas), por oficina y usuario, y permitir crecimiento por supuesto.

Este documento define una arquitectura inicial para implementar el backend con FastAPI, APIRouter, Python y uv, siguiendo convenciones y buenas practicas (PEP 8), tal como se ha especificado en las lecciones.

## 2) Patron arquitectonico propuesto

### Propuesta

Se propone una **arquitectura en capas** (router -> servicio -> repositorio -> persistencia) dentro de un **monolito modular por dominios**.

Se sugiere esta arquitectura porque son aplicaciones de uso interno para la empresa mas que servicios web para terceros.  Se facilita el mantenimiento futuro de los sistemas y servicios.

### Por que encaja con Nexova

1. **Reglas de negocio sensibles y centralizadas**
El control de inventario exige reglas estrictas (stock calculado, no permitir salidas sin stock, validaciones por tipo de salida). Tener una capa de servicios evita duplicar estas reglas en endpoints y facilita auditoria.

2. **Velocidad de entrega para el proximo requerimiento**
Al dividir por servicios, se trata de una sola aplicación o sistema, pero organizado en módulos, a saber: inventario, talento, otros hitos, etc.  Solo se van agregando servicios nuevos sobre la misma arquitectura.

3. **Escalabilidad funcional por dominio**
Tal como se indicó antes, no solo se hará el inventario; tambien talento, operaciones y otros módulos. Separar por dominio desde el inicio permite crecer sin convertir el proyecto en un archivo unico con rutas mezcladas.


## 3) Estructura de carpetas y modulos propuesta

Se recomienda una estructura de backend dentro de `services/` como aplicacion FastAPI apartada del frontend:

```text
services/
  app/
    main.py
    core/
      config.py
      db.py
      security.py
      logging.py
    domains/
      inventory/
        models.py
        schemas.py
        repository.py
        service.py
        router.py
      talent/
        models.py
        schemas.py
        repository.py
        service.py
        router.py
    api/
      router.py
      deps.py
    tests/
      test_inventory.py
      test_health.py
  pyproject.toml
  uv.lock
  README.md
```

### Criterio de separacion

1. **Por dominio de negocio**
Cada dominio (ej. `inventory`) contiene sus modelos, schemas, logica y rutas.

2. **Por responsabilidad tecnica (capas)**
- `router.py`: entrada HTTP, validacion de request/response y codigos de estado.
- `service.py`: reglas de negocio y orquestacion.
- `repository.py`: consultas y acceso a datos.
- `models.py`: entidades ORM.
- `schemas.py`: contratos Pydantic para entrada/salida.

3. **Componentes transversales en `core/`**
Configuracion, conexion de BD, seguridad, logs y utilidades compartidas.

## 4) Organizacion de endpoints y routers (FastAPI)

### Criterio general

- Un router por dominio. (inventario en su router, talento en otro router, etc.)
- Prefijos consistentes por contexto funcional (todo lo de inventario empieza con /inventario)
- No mezclar rutas de dominios distintos en un solo archivo (poner en archivos distintos)
- Versionado recomendado: `/api/v1`. Cuando se haga un versión 2, se podrá seguir trabajando en paralelo si se define como estrategia, hasta cumplir un periodo establecido.

### Propuesta inicial de rutas

#### Router de inventario
Prefijo: `/api/v1/inventory`

- `GET /products` - listar activos con `current_stock` calculado.
- `POST /products` - crear activo.
- `GET /products/{id}` - detalle de activo con stock actual.
- `POST /orders/inbound` - registrar entrada de activos.
- `POST /orders/outbound` - registrar salida (allocation/consumption).
- `GET /orders` - listar entradas y salidas con datos de activo.

Estas rutas respetan el contexto del hito de inventario (stock neto calculado, validaciones de salida, trazabilidad por `office` y `user_uuid`).

#### Router de salud del sistema
Para el monitoreo del sistema, revisión cuando algo falla, etc.
Prefijo: `/api/v1/health`

- `GET /` - healthcheck para CI/CD y monitoreo basico.

#### Router de autenticacion (si aplica en fases siguientes)
Prefijo: `/api/v1/auth`

- Endpoints para login/verificacion de token si se incorpora autenticacion propia.
- Mientras TinyDB sea sistema externo de usuarios, el backend solo valida/propaga `user_uuid`.

## 5) Convenciones FastAPI investigadas y como impactan la propuesta

La propuesta sigue convenciones ampliamente usadas en FastAPI (documentacion oficial y guias de "bigger applications"):

1. **Separar `main.py` de routers**
`main.py` crea la app y monta routers, evitando que toda la API viva en un unico archivo.

2. **Usar `APIRouter` por modulo**
Permite agrupar rutas, etiquetas, prefijos y dependencias por dominio.

3. **Separar modelos ORM y schemas Pydantic**
Evita acoplar persistencia con contrato HTTP y facilita evolucion de API sin romper BD.

4. **Dependencias con `Depends`**
Estandariza inyeccion de DB/session/config para testing y mantenibilidad.

5. **Configuracion por entorno**
Variables de entorno para secretos y URLs, sin hardcodear credenciales.

## 6) Frontend y backend como sistemas separados

Frontend y backend deben tratarse como sistemas separados que se comunican por API HTTP.

### Decisiones clave

1. **Contrato de comunicacion por API**
El frontend consume endpoints versionados (`/api/v1/...`) y no accede directo a la base de datos.

2. **Gestion de CORS**
Configurar lista explicita de origenes permitidos (dev/staging/prod). Evitar `*` en produccion.  Esto permite configurar quién puede llamar la API desde cualquier navegador. Cuales son los métodos permitidos, etc.

3. **Variables de entorno separadas**
- Frontend: `NEXT_PUBLIC_API_BASE_URL` (u homologo).
- Backend: `DATABASE_URL`, `CORS_ORIGINS`, `ENV`, etc.

4. **Despliegue independiente**
Permitir publicar frontend y backend por separado, con versionado de API para evitar roturas entre releases.

## 7) Decisiones tecnicas iniciales

1. **Framework API**: FastAPI con APIRouter.
2. **Lenguaje y estilo**: Python con cumplimiento PEP 8.
3. **Gestion de entorno/dependencias**: uv (`pyproject.toml` + `uv.lock`).
4. **Modelo de datos inventario**: `Asset`, `AssetEntry`, `AssetExit`.
5. **Regla de stock**: `current_stock = SUM(entries) - SUM(exits)` calculado, nunca persistido.
6. **Validaciones criticas**:
   - no permitir salida con stock insuficiente;
   - `assigned_to` obligatorio en `allocation` y nulo en `consumption`.
7. **Trazabilidad operativa**: incluir `office` y `user_uuid` en operaciones de entrada/salida.

## 8) Riesgos y puntos de atencion

1. **Riesgo: mezclar logica de negocio en routers**
Si las reglas quedan en endpoints, se duplicaran validaciones y apareceran inconsistencias entre rutas.

2. **Riesgo: no calcular stock de forma transaccional/consistente**
Si se calcula de manera parcial o en lugares distintos, pueden aprobarse salidas sin stock real.

3. **Riesgo: CORS y variables de entorno mal configuradas**
Puede bloquearse la comunicacion frontend-backend en dev/prod o exponerse la API a origenes no deseados.

4. **Riesgo: crecimiento sin separacion por dominio**
Agregar nuevos modulos en una estructura plana terminara en deuda tecnica alta y baja velocidad de cambios.

## 9) Conclusion

Para Nexova, la mejor opcion de arranque es un monolito modular con arquitectura en capas. Esta decision equilibra velocidad de entrega y orden estructural, incorpora convenciones reales de FastAPI, y reduce riesgos operativos en un dominio sensible como inventario

## NOTA:

Elaborado con ayuda de Copilot y revisado solicitando aclaratorias a la IA, algunas de las cuales se incluyeron en el documento.

## Nexova Talent Pipeline Tracker

Aplicacion interna de Nexova para el equipo de People & Talent. Permite listar candidaturas, filtrarlas por estado y etapa, registrar nuevas personas candidatas, revisar el detalle individual, actualizar el pipeline y gestionar notas internas.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```

La app queda disponible en `http://localhost:3000`.

## Funcionalidad implementada

- Listado de candidaturas con filtros por query string y busqueda por nombre o email.
- Formulario de alta de candidatura con validacion local.
- Ruta de detalle por candidato en `/candidates/[id]`.
- Actualizacion de estado y etapa con `PATCH`.
- Edicion completa con `PUT`.
- Listado, alta y borrado de notas internas.
- Estados de carga y error visibles en las operaciones asincronas.

## Estructura principal

- `app/`: rutas App Router.
- `components/`: componentes de UI reutilizables.
- `lib/`: utilidades de formato.
- `types/`: tipos especificos de la interfaz.
- `../../../Services/talentTrackerApi.ts`: cliente compartido de la API del tracker.

## Notas tecnicas

- Next.js 16 con App Router y TypeScript.
- `next.config.ts` habilita `experimental.externalDir` para importar el cliente HTTP compartido desde `Services/`.
- La API base se toma de `NEXT_PUBLIC_API_URL` si existe; en caso contrario usa la URL publica del playground.

## Validacion

- `npm run build`
- `npm run lint`

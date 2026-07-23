# Nexova Incidents Web UI

Frontend de Fase 2 para cargar el CSV, ver el resumen y descargar resultados.

## Ejecución rápida

Puedes abrir el archivo directamente o levantar un servidor estático.

```bash
cd uis/web
python -m http.server 5500
```

Luego abre `http://localhost:5500`.

## Configuración

- Campo `API base URL`: por defecto `http://localhost:8000`
- Botón `Analizar archivo`: envía `multipart/form-data` a `POST /api/incidents/analyze`
- Botón `Descargar CSV`: llama `GET /api/incidents/results/export`

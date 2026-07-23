# Nexova Incidents API

Backend para la Fase 2 del analizador de incidencias.

## Endpoints

- `POST /api/incidents/analyze`
  - Entrada: `multipart/form-data` con el campo `file` (CSV UTF-8)
  - Salida: resumen JSON del análisis
- `GET /api/incidents/results/export`
  - Salida: descarga CSV con una fila por métrica
- `GET /api/incidents/health`
  - Salida: estado de salud del servicio

## Requisitos

- Python 3.11+

## Ejecución

Desde la raíz del repositorio:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r services/api/requirements.txt
uvicorn services.api.main:app --reload --port 8000
```

El API quedará en `http://localhost:8000`.

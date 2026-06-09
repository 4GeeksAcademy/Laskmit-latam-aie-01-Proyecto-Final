"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type CandidateRecord,
  type CandidateStage,
  type CandidateStatus,
  listCandidateRecords,
  STAGE_LABELS,
  STATUS_LABELS,
} from "../../../Services/talentTrackerApi";

type RequestState = "idle" | "loading" | "success" | "error";

const STATUS_VALUES = Object.keys(STATUS_LABELS) as CandidateStatus[];
const STAGE_VALUES = Object.keys(STAGE_LABELS) as CandidateStage[];

function parseStatusFilter(value: string | null): CandidateStatus | "all" {
  if (value && STATUS_VALUES.includes(value as CandidateStatus)) {
    return value as CandidateStatus;
  }

  return "all";
}

function parseStageFilter(value: string | null): CandidateStage | "all" {
  if (value && STAGE_VALUES.includes(value as CandidateStage)) {
    return value as CandidateStage;
  }

  return "all";
}

export default function CandidatesPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [records, setRecords] = useState<CandidateRecord[]>([]);
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const statusFilter = parseStatusFilter(searchParams.get("status"));
  const stageFilter = parseStageFilter(searchParams.get("stage"));
  const searchQuery = searchParams.get("search") ?? "";

  const updateQueryParam = useCallback(
    (key: string, value: string) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (!value || value === "all") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }

      const nextQuery = nextParams.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    let cancelled = false;

    const loadRecords = async () => {
      setRequestState("loading");
      setErrorMessage("");

      try {
        const response = await listCandidateRecords({
          status: statusFilter === "all" ? undefined : statusFilter,
          stage: stageFilter === "all" ? undefined : stageFilter,
          search: searchQuery,
          page: 1,
          limit: 100,
        });

        if (!cancelled) {
          setRecords(response.data);
          setRequestState("success");
        }
      } catch (error) {
        if (!cancelled) {
          setRecords([]);
          setRequestState("error");
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "No se pudieron cargar las candidaturas.",
          );
        }
      }
    };

    void loadRecords();

    return () => {
      cancelled = true;
    };
  }, [statusFilter, stageFilter, searchQuery]);

  const statusOptions = useMemo(() => Object.entries(STATUS_LABELS), []);
  const stageOptions = useMemo(() => Object.entries(STAGE_LABELS), []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-semibold tracking-tight">Talent Pipeline Tracker</h1>
          <p className="mt-2 text-sm text-slate-600">
            Gestiona candidaturas por estado y etapa, con filtros y busqueda en tiempo real.
          </p>
        </header>

        <section className="mb-6 grid gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Buscar por nombre o email
            <input
              className="h-11 rounded-lg border border-slate-300 px-3 text-sm outline-none ring-offset-2 transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
              type="search"
                value={searchQuery}
                onChange={(event) => updateQueryParam("search", event.target.value)}
              placeholder="Ej: ana.garcia@correo.com"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Filtrar por estado
            <select
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-offset-2 transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
              value={statusFilter}
              onChange={(event) =>
                updateQueryParam("status", event.target.value)
              }
            >
              <option value="all">Todos los estados</option>
              {statusOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Filtrar por etapa
            <select
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-offset-2 transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
              value={stageFilter}
              onChange={(event) => updateQueryParam("stage", event.target.value)}
            >
              <option value="all">Todas las etapas</option>
              {stageOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
          {requestState === "loading" && (
            <p className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              Cargando candidaturas...
            </p>
          )}

          {requestState === "error" && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              Error al cargar candidaturas: {errorMessage}
            </p>
          )}

          {requestState === "success" && records.length === 0 && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              No hay candidaturas que coincidan con los filtros seleccionados.
            </p>
          )}

          {records.length > 0 && (
            <>
              <p className="mb-4 text-sm text-slate-600">
                Mostrando {records.length} candidatura{records.length === 1 ? "" : "s"}.
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-3 py-2">Nombre</th>
                      <th className="px-3 py-2">Puesto</th>
                      <th className="px-3 py-2">Estado</th>
                      <th className="px-3 py-2">Etapa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {records.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50">
                        <td className="px-3 py-3">
                          <p className="font-medium text-slate-900">{record.full_name}</p>
                          <p className="text-xs text-slate-500">{record.email}</p>
                        </td>
                        <td className="px-3 py-3 text-slate-700">{record.position}</td>
                        <td className="px-3 py-3">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            {STATUS_LABELS[record.status]}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                            {STAGE_LABELS[record.stage]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

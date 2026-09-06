/**
 * FitnessZone API Client
 * Calls the real Django backend at http://localhost:8000/api/
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function setAccessToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("access_token", token);
  else localStorage.removeItem("access_token");
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    localStorage.setItem("access_token", data.access);
    return data.access;
  } catch {
    return null;
  }
}


async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();

  const buildHeaders = (t: string | null): Record<string, string> => ({
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
  });

  let res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: buildHeaders(token),
  });

  if (res.status === 401) {
    if (token) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        res = await fetch(`${API_BASE}${endpoint}`, {
          ...options,
          headers: buildHeaders(newToken),
        });
      }
    }
    if (res.status === 401 && !endpoint.startsWith("/auth/token")) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
        // Return an empty promise that never resolves to pause execution during redirect
        return new Promise(() => {});
      }
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? err.error ?? err.message ?? "API Error");
  }
  if (res.status === 204) return {} as T;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    apiFetch<{ access: string; refresh: string; role: string }>("/auth/token/", {
      method: "POST",
      body: JSON.stringify({ mobile: username, password }),
    }),
  getProfile: () => apiFetch<any>("/auth/me/"),
  updateProfile: (data: any) =>
    apiFetch<any>("/auth/me/", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  changePassword: (data: any) =>
    apiFetch<any>("/auth/change-password/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── Trainers ──────────────────────────────────────────────────
export const trainersApi = {
  list: (search = "", page = 1) =>
    apiFetch<{ count: number; results: import("@/types").Trainer[] }>(
      `/trainers/?search=${encodeURIComponent(search)}&page=${page}`
    ),
  get: (id: number) =>
    apiFetch<import("@/types").Trainer>(`/trainers/${id}/`),
  create: (data: Record<string, unknown>) =>
    apiFetch<import("@/types").Trainer>("/trainers/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Record<string, unknown>) =>
    apiFetch<import("@/types").Trainer>(`/trainers/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiFetch<void>(`/trainers/${id}/`, { method: "DELETE" }),
  performance: (id: number) =>
    apiFetch<import("@/types").TrainerMonthlyPerformance[]>(`/trainers/${id}/performance/`),
  nextMonthTarget: (id: number) =>
    apiFetch<import("@/types").NextMonthTarget>(`/trainers/${id}/next-month-target/`),
  overrideTarget: (id: number, newTarget: number, reason: string) =>
    apiFetch<import("@/types").TrainerMonthlyPerformance>(`/trainers/${id}/override-target/`, {
      method: "POST",
      body: JSON.stringify({ new_target: newTarget, reason }),
    }),
  updateAchieved: (id: number, achieved: number) =>
    apiFetch<import("@/types").TrainerMonthlyPerformance>(`/trainers/${id}/update-achieved/`, {
      method: "POST",
      body: JSON.stringify({ achieved }),
    }),
};

// ── Trainer Portal ─────────────────────────────────────────────
export const trainerApi = {
  getDashboard: (trainerId?: number) => {
    const params = trainerId ? `?trainer_id=${trainerId}` : "";
    return apiFetch<any>(`/trainers/dashboard/${params}`);
  },
};

// ── Reports ───────────────────────────────────────────────────
export const reportsApi = {
  dashboard: () =>
    apiFetch<import("@/types").AdminDashboardStats>("/reports/dashboard/"),
};

// ── Members ───────────────────────────────────────────────────
export const membersApi = {
  list: (search = "", level = "", status = "", page = 1) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (level) params.append("level", level);
    if (status) params.append("status", status);
    params.append("page", page.toString());
    return apiFetch<{ count: number; next: string | null; previous: string | null; results: import("@/types").MemberSummary[] }>(`/members/?${params.toString()}`);
  },
  create: (data: Record<string, unknown>) =>
    apiFetch<import("@/types").MemberSummary>("/members/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  assignPlan: (memberId: number, data: { plan_id: number; start_date: string }) =>
    apiFetch<any>(`/members/${memberId}/assign_plan/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── Staff ─────────────────────────────────────────────────────
export const staffApi = {
  list: () => apiFetch<{ count: number; results: any[] } | any[]>("/staff/"),
  create: (data: Record<string, unknown>) =>
    apiFetch<any>("/staff/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiFetch<void>(`/staff/${id}/`, { method: "DELETE" }),
};

// ── Memberships ───────────────────────────────────────────────
export const membershipsApi = {
  listPlans: () => apiFetch<{ count: number; results: any[] } | any[]>("/memberships/plans/"),
  createPlan: (data: Record<string, unknown>) =>
    apiFetch<any>("/memberships/plans/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePlan: (id: number, data: Record<string, unknown>) =>
    apiFetch<any>(`/memberships/plans/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deletePlan: (id: number) =>
    apiFetch<void>(`/memberships/plans/${id}/`, { method: "DELETE" }),
};

// ── Member Portal ─────────────────────────────────────────────
export const memberPortalApi = {
  getDashboard: () =>
    apiFetch<import("@/types").MemberDashboard>("/members/dashboard/"),

  getGoals: () => apiFetch<import("@/types").PaginatedResponse<import("@/types").Goal>>("/members/goals/").then(res => res.results),
  createGoal: (data: any) =>
    apiFetch<import("@/types").Goal>("/members/goals/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateGoal: (id: number, data: any) =>
    apiFetch<import("@/types").Goal>(`/members/goals/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getMeasurements: () => apiFetch<import("@/types").PaginatedResponse<any>>("/members/measurements/").then(res => res.results),
  createMeasurement: (data: any) =>
    apiFetch<any>("/members/measurements/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

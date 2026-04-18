// // localStorage helpers — guardam quantidade atual e mês corrente
// import { monthlyConfig } from "@/config/monthly";

// const KEY = "tsurus-state-v1";

// export type StoredState = {
//   // Total acumulado (todos os meses) — máx 1000
//   total: number;
//   // Último mês registrado — quando muda, "trava" os anteriores
//   lastMonth: number;
//   // Quantidade adicionada NO mês atual
//   currentMonthCount: number;
// };

// const defaultState = (): StoredState => ({
//   total: 0,
//   lastMonth: monthlyConfig.monthNumber,
//   currentMonthCount: 0,
// });

// export function loadState(): StoredState {
//   if (typeof window === "undefined") return defaultState();
//   try {
//     const raw = localStorage.getItem(KEY);
//     if (!raw) return defaultState();
//     const parsed = JSON.parse(raw) as StoredState;
//     // Se o mês mudou, mantém o total (frozen) e zera o contador do mês
//     if (parsed.lastMonth !== monthlyConfig.monthNumber) {
//       const next: StoredState = {
//         total: parsed.total,
//         lastMonth: monthlyConfig.monthNumber,
//         currentMonthCount: 0,
//       };
//       saveState(next);
//       return next;
//     }
//     return parsed;
//   } catch {
//     return defaultState();
//   }
// }

// export function saveState(s: StoredState) {
//   if (typeof window === "undefined") return;
//   localStorage.setItem(KEY, JSON.stringify(s));
// }

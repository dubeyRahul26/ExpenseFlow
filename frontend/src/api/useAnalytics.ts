import { useQuery } from "@tanstack/react-query";
import {
  fetchPersonalAnalytics,
  fetchMonthlyAnalytics,
  fetchCategoryAnalytics
} from "./analytics";
import type { Key} from "react";

/* ---------- TYPES ---------- */

export interface PersonalAnalytics {
  totalSpent: number;
  count: number;
  netBalance: number;
  groupsCount: number;
  recent: {
    _id: Key | null | undefined;
    category: string;
    title: string;
    amount: number;
    date: string;
  }[];
}

/* ---------- HOOKS ---------- */

export const usePersonalAnalytics = () =>
  useQuery<PersonalAnalytics>({
    queryKey: ["analytics", "personal"],
    queryFn: fetchPersonalAnalytics,
    staleTime: 1000 * 60
  });

export const useMonthlyAnalytics = () =>
  useQuery({
    queryKey: ["analytics", "monthly"],
    queryFn: fetchMonthlyAnalytics,
    staleTime: 1000 * 60 * 5
  });

export const useCategoryAnalytics = () =>
  useQuery({
    queryKey: ["analytics", "category"],
    queryFn: fetchCategoryAnalytics,
    staleTime: 1000 * 60 * 5
  });

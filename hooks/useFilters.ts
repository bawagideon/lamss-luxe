"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const existingValues = params.get(key)?.split(",") || [];
    
    let newValues;
    if (existingValues.includes(value)) {
      // Toggle off: remove if already present
      newValues = existingValues.filter((v) => v !== value);
    } else {
      // Toggle on: add if not present
      newValues = [...existingValues, value];
    }

    if (newValues.length > 0) {
      params.set(key, newValues.join(","));
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  const isFilterActive = useCallback((key: string, value: string) => {
    const values = searchParams.get(key)?.split(",") || [];
    return values.includes(value);
  }, [searchParams]);

  return {
    updateFilter,
    clearFilters,
    isFilterActive,
    searchParams
  };
}

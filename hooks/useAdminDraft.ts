import { useState, useEffect, useCallback } from 'react';

export function useAdminDraft<T>(key: string, initialValues: T) {
  const [draft, setDraftState] = useState<T>(initialValues);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`admin_draft_${key}`);
    if (saved) {
      try {
        setDraftState(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        console.error("Failed to parse admin draft", e);
      }
    }
    setIsLoaded(true);
  }, [key]);

  // Persistent setter
  const updateDraft = useCallback((updates: Partial<T> | ((prev: T) => T)) => {
    setDraftState(prev => {
      const next = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      localStorage.setItem(`admin_draft_${key}`, JSON.stringify(next));
      return next;
    });
  }, [key]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(`admin_draft_${key}`);
    setDraftState(initialValues);
  }, [initialValues, key]);

  return { draft, updateDraft, clearDraft, isLoaded };
}

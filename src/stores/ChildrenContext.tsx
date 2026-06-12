import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Child } from '../types';
import { getAllChildren, insertChild, updateChild, deleteChild } from '../services/database';

interface ChildrenContextValue {
  children: Child[];
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
  addChild: (data: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>) => Child;
  editChild: (id: string, data: Partial<Omit<Child, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  removeChild: (id: string) => void;
  refresh: () => void;
}

const ChildrenContext = createContext<ChildrenContextValue | null>(null);

export function ChildrenProvider({ children: reactChildren }: { children: ReactNode }) {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const list = getAllChildren();
    setChildren(list);
    if (list.length > 0 && !selectedChildId) {
      setSelectedChildId(list[0].id);
    }
  }, [selectedChildId]);

  useEffect(() => {
    refresh();
  }, []);

  function addChild(data: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>) {
    const child = insertChild(data);
    setChildren((prev) => [...prev, child]);
    if (!selectedChildId) setSelectedChildId(child.id);
    return child;
  }

  function editChild(id: string, data: Partial<Omit<Child, 'id' | 'createdAt' | 'updatedAt'>>) {
    updateChild(id, data);
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c))
    );
  }

  function removeChild(id: string) {
    deleteChild(id);
    setChildren((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (selectedChildId === id) {
        setSelectedChildId(next.length > 0 ? next[0].id : null);
      }
      return next;
    });
  }

  return (
    <ChildrenContext.Provider
      value={{ children, selectedChildId, setSelectedChildId, addChild, editChild, removeChild, refresh }}
    >
      {reactChildren}
    </ChildrenContext.Provider>
  );
}

export function useChildren() {
  const ctx = useContext(ChildrenContext);
  if (!ctx) throw new Error('useChildren must be used within ChildrenProvider');
  return ctx;
}

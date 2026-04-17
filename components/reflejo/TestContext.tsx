"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { initialTestState, testReducer } from "@/lib/state/test-reducer";
import type { TestAction, TestState } from "@/types/test";

type TestContextValue = {
  state: TestState;
  dispatch: React.Dispatch<TestAction>;
};

const TestContext = createContext<TestContextValue | undefined>(undefined);

type TestProviderProps = {
  children: ReactNode;
};

export function TestProvider({ children }: TestProviderProps) {
  const [state, dispatch] = useReducer(testReducer, initialTestState);

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
}

export function useTestContext() {
  const context = useContext(TestContext);

  if (!context) {
    throw new Error("useTestContext debe usarse dentro de un TestProvider.");
  }

  return context;
}
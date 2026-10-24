"use client";

import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type State = { toasts: ToasterToast[] };

const listeners: ((state: State) => void)[] = [];
let memoryState: State = { toasts: [] };

function dispatch(toast: ToasterToast) {
  memoryState = {
    toasts: [toast, ...memoryState.toasts].slice(0, TOAST_LIMIT),
  };
  listeners.forEach((listener) => listener(memoryState));

  setTimeout(() => {
    memoryState = {
      toasts: memoryState.toasts.filter((t) => t.id !== toast.id),
    };
    listeners.forEach((listener) => listener(memoryState));
  }, TOAST_REMOVE_DELAY);
}

function toast(props: Omit<ToasterToast, "id">) {
  const id = Math.random().toString(36).slice(2, 9);
  dispatch({ ...props, id });
  return id;
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return { ...state, toast };
}

export { useToast, toast };

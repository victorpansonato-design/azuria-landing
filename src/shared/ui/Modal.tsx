"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
export function Modal({
  children,
  label,
  onClose,
  className = "",
}: {
  children: ReactNode;
  label: string;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const lockId = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current!;
    dialog.showModal();
    document.documentElement.classList.add("modal-open");
    window.dispatchEvent(
      new CustomEvent("azuria-scroll-lock", {
        detail: { id: lockId, locked: true },
      }),
    );
    return () => {
      dialog.close();
      document.documentElement.classList.remove("modal-open");
      window.dispatchEvent(
        new CustomEvent("azuria-scroll-lock", {
          detail: { id: lockId, locked: false },
        }),
      );
      previous?.focus();
    };
  }, [lockId]);
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-label={label}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button className="close-button" onClick={onClose} aria-label="Fechar">
        ×
      </button>
      {children}
    </dialog>
  );
}

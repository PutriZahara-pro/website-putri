"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { ContactModal } from "@/components/ui/contact-modal";

interface ContactCtx { open: () => void }
const ContactContext = createContext<ContactCtx>({ open: () => {} });

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open  = useCallback(() => setIsOpen(true),  []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ContactContext.Provider value={{ open }}>
      {children}
      {isOpen && <ContactModal onClose={close} />}
    </ContactContext.Provider>
  );
}

export const useContact = () => useContext(ContactContext);

import type { Timestamp } from "firebase/firestore";

export interface Visitor {
  id: string;
  name: string;
  isBeliever: "sim" | "nao";
  churchName?: string;
  contact?: string;
  wantsVisit: boolean;
  visitDate: Date;
  observations?: string;
}

export interface VisitorInput {
  name: string;
  isBeliever: "sim" | "nao";
  churchName?: string;
  contact?: string;
  wantsVisit: boolean;
  observations?: string;
}

export interface VisitorDocument {
  name: string;
  isBeliever: "sim" | "nao";
  churchName?: string;
  contact?: string;
  wantsVisit: boolean;
  visitDate: Timestamp;
  observations?: string;
}

import type { Timestamp } from "firebase/firestore";

export interface PrayerRequest {
  id: string;
  name?: string;
  request: string;
  createdAt: Date;
}

export interface PrayerRequestInput {
  name?: string;
  request: string;
}

export interface PrayerRequestDocument {
  name?: string;
  request: string;
  createdAt: Timestamp;
}

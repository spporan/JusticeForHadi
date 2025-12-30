import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TimeElapsed } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAssetPath(path: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}

export function calculateElapsedTime(startDate: Date): TimeElapsed {
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  console.log(days, hours, minutes);
  console.log(" startDate.getTime() ", startDate.getTime());
  console.log(" now.getTime() ", now.getTime());
  console.log("diffMs ", diffMs);
  console.log("startDate ", startDate);
  console.log("now ", now);

  return { days, hours, minutes };
}

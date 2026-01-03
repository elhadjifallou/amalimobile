import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Fonction utilitaire pour combiner les classes CSS avec Tailwind
 * @param inputs - Classes CSS à combiner
 * @returns String de classes combinées
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

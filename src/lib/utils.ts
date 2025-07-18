import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAge(dateString: string): number {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function getLetterGrade(grade: number): string {
    if (grade >= 19) return 'A+';
    if (grade >= 17) return 'A';
    if (grade >= 15) return 'B+';
    if (grade >= 13) return 'B';
    if (grade >= 11) return 'C+';
    if (grade >= 10) return 'C';
    if (grade >= 8) return 'D';
    return 'F';
}

export function getGpaFromNumeric(grade: number): number {
    if (grade >= 19) return 4.0;
    if (grade >= 17) return 3.7;
    if (grade >= 15) return 3.3;
    if (grade >= 13) return 3.0;
    if (grade >= 11) return 2.3;
    if (grade >= 10) return 2.0;
    if (grade >= 8) return 1.0;
    return 0.0;
}

export function formatGradeDisplay(grade: number | string, system?: '20-Point' | 'Letter' | 'GPA'): string {
    const numericGrade = typeof grade === 'string' ? parseFloat(grade) : grade;
    if (isNaN(numericGrade)) return 'N/A';

    switch (system) {
        case 'Letter':
            return getLetterGrade(numericGrade);
        case 'GPA':
            return getGpaFromNumeric(numericGrade).toFixed(1);
        case '20-Point':
        default:
            return numericGrade.toFixed(1);
    }
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(amount);
}
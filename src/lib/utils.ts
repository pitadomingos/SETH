import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { SchoolProfile } from "./mock-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getLetterGrade = (numericGrade: number): string => {
    if (numericGrade >= 19) return 'A+';
    if (numericGrade >= 17) return 'A';
    if (numericGrade >= 16) return 'A-';
    if (numericGrade >= 15) return 'B+';
    if (numericGrade >= 14) return 'B';
    if (numericGrade >= 13) return 'B-';
    if (numericGrade >= 12) return 'C+';
    if (numericGrade >= 11) return 'C';
    if (numericGrade >= 10) return 'C-';
    if (numericGrade >= 8) return 'D';
    return 'F';
};

export const getGpaFromNumeric = (numericGrade: number): number => {
    return parseFloat((numericGrade / 5.0).toFixed(1)); // 20-point scale divided by 5 gives 4.0 scale
};

export const formatGradeDisplay = (grade: string | number, system?: SchoolProfile['gradingSystem']): string => {
    const numericGrade = typeof grade === 'string' ? parseFloat(grade) : grade;
    if (isNaN(numericGrade)) return String(grade); 

    switch (system) {
        case 'GPA':
            return `${getGpaFromNumeric(numericGrade).toFixed(1)} (${getLetterGrade(numericGrade)})`;
        case 'Letter':
            return getLetterGrade(numericGrade);
        case '20-Point':
        default:
            return `${numericGrade}/20`;
    }
};

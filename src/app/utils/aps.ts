export interface APSSubject {
  name: string;
  mark: number;
  points: number;
}

export function getAPSPoints(mark: number): number {
  if (mark >= 80) return 7;
  if (mark >= 70) return 6;
  if (mark >= 60) return 5;
  if (mark >= 50) return 4;
  if (mark >= 40) return 3;
  if (mark >= 30) return 2;
  return 1;
}

export function calculateTotalAPS(subjects: APSSubject[]): number {
  return [...subjects]
    .sort((a, b) => b.points - a.points)
    .slice(0, 6)
    .reduce((sum, subject) => sum + subject.points, 0);
}

export function normalizeSubjectName(name: string): string {
  return name.toLowerCase().replace(/[^a-z]/g, "");
}

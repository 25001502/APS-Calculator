import { universities, type University } from "../data/universities";
import { normalizeSubjectName, type APSSubject } from "./aps";

export interface SubjectRequirement {
  label: string;
  match: string[];
  minMark: number;
}

export interface ProgramOpportunity {
  id: string;
  university: University;
  facultyName: string;
  program: string;
  minAPS: number;
  field: string;
  requirements: SubjectRequirement[];
}

export interface RequirementResult extends SubjectRequirement {
  met: boolean;
  actualMark?: number;
}

const fieldRules = [
  { field: "Health", terms: ["medicine", "nursing", "pharmacy", "health", "physio", "dent", "biomedical", "radiography", "nutrition"] },
  { field: "Engineering", terms: ["engineering", "built environment", "architecture", "surveying"] },
  { field: "Business", terms: ["commerce", "business", "account", "economics", "management", "marketing", "logistics", "hospitality", "retail"] },
  { field: "Law", terms: ["law", "llb", "legal", "paralegal"] },
  { field: "Education", terms: ["education", "bed", "teaching"] },
  { field: "Science", terms: ["science", "agriculture", "computer", "data", "ict", "biotechnology", "environmental", "chemistry", "mathematics"] },
  { field: "Humanities", terms: ["humanities", "arts", "social", "psychology", "journalism", "communication", "language", "heritage"] },
];

export function getProgramOpportunities(): ProgramOpportunity[] {
  return universities.flatMap((university) =>
    university.faculties.flatMap((faculty) =>
      faculty.programs.map((program) => ({
        id: `${university.id}-${faculty.name}-${program}`,
        university,
        facultyName: faculty.name,
        program,
        minAPS: faculty.minAPS,
        field: inferField(`${faculty.name} ${program}`),
        requirements: getSubjectRequirements(`${faculty.name} ${program}`),
      }))
    )
  );
}

export function inferField(value: string): string {
  const normalized = value.toLowerCase();
  return fieldRules.find((rule) => rule.terms.some((term) => normalized.includes(term)))?.field ?? "General";
}

export function getSubjectRequirements(value: string): SubjectRequirement[] {
  const normalized = value.toLowerCase();
  const requirements: SubjectRequirement[] = [];

  if (includesAny(normalized, ["engineering", "architecture", "surveying", "computer", "data", "ict", "mathematics"])) {
    requirements.push({ label: "Mathematics", match: ["mathematics"], minMark: 50 });
  }

  if (includesAny(normalized, ["engineering", "medicine", "pharmacy", "dent", "physio", "biomedical", "radiography", "chemistry"])) {
    requirements.push({ label: "Physical Sciences", match: ["physicalsciences"], minMark: 50 });
  }

  if (includesAny(normalized, ["medicine", "nursing", "pharmacy", "health", "physio", "dent", "biomedical", "nutrition"])) {
    requirements.push({ label: "Life Sciences", match: ["lifesciences"], minMark: 50 });
  }

  if (includesAny(normalized, ["law", "llb", "education", "journalism", "communication", "language", "social work", "psychology"])) {
    requirements.push({ label: "English", match: ["englishhomelanguage", "englishfirstadditionallanguage"], minMark: 50 });
  }

  if (includesAny(normalized, ["account", "commerce", "business", "economics", "management"])) {
    requirements.push({ label: "Mathematics or Mathematical Literacy", match: ["mathematics", "mathematicalliteracy"], minMark: 50 });
  }

  return requirements;
}

export function checkRequirements(requirements: SubjectRequirement[], subjects: APSSubject[]): RequirementResult[] {
  return requirements.map((requirement) => {
    const subject = subjects.find((candidate) =>
      requirement.match.includes(normalizeSubjectName(candidate.name))
    );

    return {
      ...requirement,
      met: Boolean(subject && subject.mark >= requirement.minMark),
      actualMark: subject?.mark,
    };
  });
}

function includesAny(value: string, terms: string[]): boolean {
  return terms.some((term) => value.includes(term));
}

export type ProfileFactor = 'D' | 'I' | 'S' | 'C';

export interface DiscQuestion {
  id: string;
  factor: ProfileFactor;
  text: string;
  interpretation: string;
  trait?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  timeAtCompany: string;
  address: string;
  phone: string;
  email: string;
  observations: string;
  assessment?: DiscAssessment;
}

export interface DiscAssessment {
  answers: Record<string, number>; // questionId -> score (1-5)
  scores: Record<ProfileFactor, number>;
  percentages: Record<ProfileFactor, number>;
  predominant: ProfileFactor;
  secondary: ProfileFactor;
  date: string;
  reportObservations?: string;
}

export interface ProfileDescription {
  factor: ProfileFactor;
  name: string;
  description: string;
  strength: string;
  attention: string;
  suggestedRoles: string[];
}


export interface Question {
  statement: string;
  points: number;
  question_index: number;
  parent_exercice_index: number;
}

export interface Exercice {
  name: string;
  index: number;
  questions: Question[];
}

export interface Consultation {
  id?: string;
  course: string | undefined;
  date: Date;
  duration: number;
  level: string;
  speciality: string;
  exam_correction_file? : File | null;
  gradings: Exercice[];
  professor_id : string | undefined;
}

export type ConsultationCardProps = {
  consultationItem: Consultation;
  action : string
};

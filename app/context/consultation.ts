import { mergeProps } from '@base-ui/react/merge-props';
import { atom } from "jotai";
import { Consultation } from "../types/types";

export const consultationAtom = atom<Consultation>({
  id : "",
  course: "",
  date: new Date(),
  duration: 0,
  level: "",
  speciality: "",
  exam_correction_file: null,
  gradings: [],
  professor_id: "",
  isPublic : true
});
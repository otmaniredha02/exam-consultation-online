import { atom } from "jotai";
import { Consultation } from "../types/types";

export const consultationAtom = atom<Consultation>({
  course: "",
  date: new Date(),
  duration: 0,
  level: "",
  speciality: "",
  exam_correction_file: null,
  gradings: [],
  professor_id: ""
});
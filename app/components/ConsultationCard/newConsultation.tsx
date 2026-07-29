"use client";

import { DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import "./style.css";

import {
  BookOpen,
  CalendarDays,
  FileSpreadsheet,
  GraduationCap,
  Layers3,
  ListChecks,
  Timer,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Grading from "./Grading";
import { useAtom } from "jotai";
import { consultationAtom } from "@/app/context/consultation";

import { pb } from "@/lib/database/pocketdb";

export function NewConsultationDialog() {
  const [consultation, setConsultation] = useAtom(consultationAtom);

  const handleConsultationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    setConsultation((prev) => ({
      ...prev,
      course: form.get("course")?.toString() ?? "",
      date: new Date(form.get("date")?.toString() ?? ""),
      duration: Number(form.get("duration") ?? 0),
      level : form.get("level")?.toString() ?? "",
      speciality: form.get("speciality")?.toString() ?? "",
      professor_id: pb.authStore.record?.id,
      exam_correction_file:
        (form.get("exam_correction_file") as File) ?? null,
    }));

    console.log({
      ...consultation,
      course: form.get("course")?.toString() ?? "",
      date: new Date(form.get("date")?.toString() ?? ""),
      duration: Number(form.get("duration") ?? 0),
      speciality: form.get("speciality")?.toString() ?? "",
      exam_correction_file:
        (form.get("exam_correction_file") as File) ?? null,
      professor_id : pb.authStore.record?.id
    });
    console.log(consultation)
    pb.collection("consultation").create(consultation).then((r)=>{
        console.log(r)
    }).catch((e)=>{
        console.log(e)
    });
    console.log(consultation);
    document.body.click()
  };

  return (
    <DialogContent>
      <DialogTitle style={{ fontSize: "1.5rem" }}>
        Consultation
      </DialogTitle>

      <form
        className="consultation"
        onSubmit={handleConsultationSubmit}
      >
        <div className="consultation-fields">
          {/* Course */}

          <div className="formlabel">
            <BookOpen />
            <Label htmlFor="course">Course</Label>
          </div>

          <Input
            id="course"
            name="course"
            placeholder="Algorithms and Data Structures"
          />

          {/* Date */}

          <div className="formlabel">
            <CalendarDays size={16} />
            <Label htmlFor="date">Date</Label>
          </div>

          <Input
            id="date"
            name="date"
            type="datetime-local"
          />

          {/* Duration */}

          <div className="formlabel">
            <Timer />
            <Label htmlFor="duration">
              Duration (minutes)
            </Label>
          </div>

          <Input
            id="duration"
            name="duration"
            type="number"
          />

          {/* Level */}

          <div className="formlabel">
            <GraduationCap />
            <Label>Level</Label>
          </div>

          <Select
            onValueChange={(value) =>
              setConsultation((prev) => ({
                ...prev,
                level: value as string,
              }))
            }
          >
            <SelectTrigger style={{ width: "100%" }}>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="License 1">
                  License 1
                </SelectItem>

                <SelectItem value="License 2">
                  License 2
                </SelectItem>

                <SelectItem value="License 3">
                  License 3
                </SelectItem>

                <SelectItem value="Master 1">
                  Master 1
                </SelectItem>

                <SelectItem value="Master 2">
                  Master 2
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Speciality */}

          <div className="formlabel">
            <Layers3 size={16} />
            <Label htmlFor="speciality">
              Speciality
            </Label>
          </div>

          <Input
            id="speciality"
            name="speciality"
          />

          {/* Correction file */}

          <div className="formlabel">
            <FileSpreadsheet />
            <Label htmlFor="exam_correction_file">
              Exam correction
            </Label>
          </div>

          <Input
            id="exam_correction_file"
            name="exam_correction_file"
            type="file"
          />

          {/* Grading */}

          <div className="formlabel">
            <ListChecks />
            <Label>Grading</Label>
          </div>

          <Grading />
        </div>

        <Button
          type="submit"
          className="consultation-submit"
        >
          Submit
        </Button>
      </form>
    </DialogContent>
  );
}
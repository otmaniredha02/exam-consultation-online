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
import { Consultation, ConsultationCardProps, Exercice } from "@/app/types/types";
import { useState } from "react";

export function NewConsultationDialog({
  consultationItem,
  action
}: ConsultationCardProps) {
  const [consultation, setConsultation] = useAtom(consultationAtom);

  // Radix/shadcn Select doesn't register itself in native FormData,
  // so its value has to be tracked separately from the rest of the form.
  const [level, setLevel] = useState<string>(consultationItem?.level ?? "");

  const handleConsultationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    console.log(form)
    const file = form.get("exam_correction_file") as File;
    const newConsultation: Consultation = {
      course: form.get("course")?.toString() ?? consultation.course,
      date: new Date(form.get("date")?.toString() ?? consultation.date.toDateString()),
      duration: Number(form.get("duration") ?? consultation.duration),
      level  : form.get("level")?.toString() ?? consultation.level,
      speciality: form.get("speciality")?.toString() ?? consultation.speciality,
      gradings : consultation.gradings,
      professor_id: pb.authStore.record?.id ?? consultation.professor_id,
    };

    if (file && file.size > 0) {
      newConsultation.exam_correction_file = file;
    }

    setConsultation(newConsultation);
    try {
      if(action == "CREATE") {
        const record = await pb
        .collection("consultation")
        .create(newConsultation);
      } else if(action == "UPDATE") {
        const record = await pb
        .collection("consultation")
        .update(consultationItem.id,newConsultation)
        .then((r)=>{
          //
        })
        .catch((e)=>{
          console.log(e)
        });
      }
    } catch (err) {
      console.error(err);
    }

    document.body.click();
  };

  return (
    <DialogContent>
      <DialogTitle style={{ fontSize: "1.5rem" }}>Consultation</DialogTitle>

      <form className="consultation" onSubmit={handleConsultationSubmit}>
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
            defaultValue={consultationItem?.course}
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
            defaultValue={
              consultationItem?.date
                ? new Date(consultationItem.date).toISOString().slice(0, 16)
                : undefined
            }
          />

          {/* Duration */}

          <div className="formlabel">
            <Timer />
            <Label htmlFor="duration">Duration (minutes)</Label>
          </div>

          <Input
            id="duration"
            name="duration"
            type="number"
            defaultValue={consultationItem?.duration}
          />

          {/* Level */}

          <div className="formlabel">
            <GraduationCap />
            <Label>Level</Label>
          </div>

          <Select name="level" value={level} onValueChange={(value) => setLevel(value ?? "")}>
            <SelectTrigger style={{ width: "100%" }}>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="License 1">License 1</SelectItem>
                <SelectItem value="License 2">License 2</SelectItem>
                <SelectItem value="License 3">License 3</SelectItem>
                <SelectItem value="Master 1">Master 1</SelectItem>
                <SelectItem value="Master 2">Master 2</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Speciality */}

          <div className="formlabel">
            <Layers3 size={16} />
            <Label htmlFor="speciality">Speciality</Label>
          </div>

          <Input
            id="speciality"
            name="speciality"
            defaultValue={consultationItem?.speciality}
          />

          {/* Correction file */}

          <div className="formlabel">
            <FileSpreadsheet />
            <Label htmlFor="exam_correction_file">Exam correction</Label>
          </div>
          <Input value={consultationItem?.exam_correction_file?.name} id="exam_correction_file" name="exam_correction_file" type="file" />

          {/* Grading */}

          <div className="formlabel">
            <ListChecks />
            <Label>Grading</Label>
          </div>

          <Grading gradings={consultationItem?.gradings}/>
        </div>

        <Button type="submit" className="consultation-submit">
          Submit
        </Button>
      </form>
    </DialogContent>
  );
}
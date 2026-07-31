"use client";

import { Button } from "@/components/ui/button";
import "./ConsulationCard.css";
import {
  BookOpen,
  CalendarDays,
  Edit,
  GraduationCap,
  Layers3,
  Timer,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Consultation, ConsultationCardProps } from "../types/types";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { NewConsultationDialog } from "../components/ConsultationCard/newConsultation";


export function ConsultationCard({consultationItem }: ConsultationCardProps) {
  return (
    <Card className="consultation-card">
       <Dialog>
        <DialogTrigger>
            <Edit className="hover:bg-blue-400" 
      style={{transform:'translate(1020%,-1rem)',position:'absolute' }}/>
        </DialogTrigger>
          <NewConsultationDialog consultationItem={consultationItem} action="UPDATE" />
       </Dialog>
      <h1>
        <BookOpen size={20} />
        {consultationItem.course}
      </h1>

      <p>
        <CalendarDays size={16} />
        Date: {consultationItem.date.toString()}
      </p>

      <p>
        <Timer />
        Duration: {consultationItem.duration} min
      </p>

      <p>
        <GraduationCap size={16} />
        Level: {consultationItem.level}
      </p>

      <p>
        <Layers3 size={16} />
        Speciality: {consultationItem.speciality}
      </p>
      <Button>Join</Button>
    </Card>
  );
}
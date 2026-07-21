"use client";

import { Button } from "@/components/ui/button";
import "./ConsulationCard.css";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Layers3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ConsultationCard() {
  return (
    <Card className="consultation-card">
      <h1>
        <BookOpen size={20} />
        Algorithms and Data Structures
      </h1>

      <p>
        <CalendarDays size={16} />
        Date: 23/07/26
      </p>

      <p>
        <GraduationCap size={16} />
        Level: M2
      </p>

      <p>
        <Layers3 size={16} />
        Speciality: MICR
      </p>
      <Button>Join</Button>
    </Card>
  );
}
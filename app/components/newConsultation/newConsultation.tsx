"use client";

import { DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import './style.css';
import { CalendarDays, School } from "lucide-react";

export function NewConsultationDialog() {
    const handleConsultationSubmit = async () => {
        alert("hello");
        return;
    }
    return (
        <DialogContent>
            <DialogTitle style={{fontSize:'1.5rem'}}>
                Consultation
            </DialogTitle>
            <form 
            className="consultation"
            onSubmit={handleConsultationSubmit}>
               {/* course name input*/}
               <div className="formlabel">
                    <School />
                    <Label>Course</Label>
               </div>
                <Input placeholder="eg. Alogrithmes and Data Structures"/>
                {/* date input*/}
                <div className="formlabel">
                    <CalendarDays />
                    <Label>Date</Label>
               </div>
               <Input type="datetime-local"/>

                 {/* duration input*/}
                <div className="formlabel">
                    <CalendarDays />
                    <Label>Duration</Label>
               </div>
               <Input type="number"/>

                 {/* level input*/}
                <div className="formlabel">
                    <CalendarDays />
                    <Label>Level</Label>
               </div>
               <Input/>

                 {/* speciality input*/}
                <div className="formlabel">
                    <CalendarDays />
                    <Label>Speciality</Label>
               </div>
               <Input/>

               <Button type="submit" >Submit</Button>
            </form>
        </DialogContent>
    );  
}
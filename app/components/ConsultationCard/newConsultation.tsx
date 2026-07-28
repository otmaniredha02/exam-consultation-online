"use client";

import { DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import './style.css';
import { BookOpen, CalendarDays, FileSpreadsheet, GraduationCap, Layers3, ListChecks, Timer } from "lucide-react";
import { Select, SelectContent, SelectTrigger, SelectItem, SelectGroup } from "@/components/ui/select";
import Grading from "./Grading";



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
                
                <div className="consultation-fields">
                    {/* course name input*/}
                    <div className="formlabel">
                        <BookOpen />
                        <Label>Course</Label>
                    </div>
                    <Input placeholder="eg. Alogrithmes and Data Structures"/>

                    {/* date input*/}
                    <div className="formlabel">
                        <CalendarDays size={16} />
                        <Label>Date</Label>
                    </div>
                    <Input type="datetime-local"/>

                    {/* duration input*/}
                    <div className="formlabel">
                        <Timer/>
                        <Label>Duration</Label>
                    </div>
                    <Input type="text"/>

                    {/* level input*/}
                    <div className="formlabel">
                        <GraduationCap />
                        <Label>Level</Label>
                    </div>
                    <Select>
                        <SelectTrigger style={{width:'100%'}}>
                            Level
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem>
                                    License 1
                                </SelectItem>
                                <SelectItem>
                                    License 2
                                </SelectItem>
                                <SelectItem>
                                    License 3
                                </SelectItem>
                                <SelectItem>
                                    Master 1
                                </SelectItem>
                                <SelectItem>
                                    Master 2
                                </SelectItem>
                                </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* speciality input*/}
                    <div className="formlabel">
                        <Layers3 size={16} />
                        <Label>Speciality</Label>
                    </div>
                    <Input/>

                    {/* correction examplar sheet file input*/}
                    <div className="formlabel">
                        <FileSpreadsheet />
                        <Label>Exam correction</Label>
                    </div>
                    <Input type="file"/>

                      <div className="formlabel">
                        <ListChecks />
                        <Label>Grading</Label>
                    </div>
                    <Grading></Grading>
                    
                </div>
                


                <Button type="submit" className="consultation-submit">Submit</Button>
            </form>
        </DialogContent>
    );  
}
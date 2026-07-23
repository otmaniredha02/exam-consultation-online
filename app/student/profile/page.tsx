"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, GraduationCap, Calendar } from "lucide-react";
import { pb } from "@/lib/database/pocketdb";

export default function StudentProfile() {
  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <Card className="overflow-hidden">
          {/* Cover */}
          <div />

          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-40 w-40 border-4 border-white shadow-lg">
              <AvatarImage src="https://i.pravatar.cc/300?img=1" />
              <AvatarFallback>OR</AvatarFallback>
            </Avatar>

            <h1 className="mt-4 text-3xl font-bold">{ pb.authStore.record?.username.split("_").join(" ") }</h1>

            <p className="text-muted-foreground">
              { pb.authStore.record?.level }| { pb.authStore.record?.speciality }
            </p>

          </CardHeader>

          <CardContent className="grid gap-6 p-8 lg:grid-cols-3">
            {/* Left */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    Contact Information
                  </h2>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail size={18} />
                    <span>redha@example.com</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={18} />
                    <span>+213 555 12 34 56</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin size={18} />
                    <span>Saïda, Algeria</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Personal Details</h2>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Date of Birth</span>
                    <span>12 May 2001</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Gender</span>
                    <span>Male</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Nationality</span>
                    <span>Algerian</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle */}
            <div className="space-y-6 lg:col-span-2">   
            <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    Academic Information
                  </h2>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">
                  <div className="flex gap-3">
                    <GraduationCap className="mt-1" />
                    <div>
                      <h3 className="font-semibold">Degree</h3>
                      <p className="text-muted-foreground">
                        Master in Computer Science
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Calendar className="mt-1" />
                    <div>
                      <h3 className="font-semibold">Academic Year</h3>
                      <p className="text-muted-foreground">2025 - 2026</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold">Student ID</h3>
                    <p className="text-muted-foreground">CS20251234</p>
                  </div>

                  <div>
                    <h3 className="font-semibold">GPA</h3>
                    <p className="text-muted-foreground">3.84 / 4.00</p>
                  </div>

                  <div>
                    <h3 className="font-semibold">Department</h3>
                    <p className="text-muted-foreground">
                      Computer Science
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold">Class</h3>
                    <p className="text-muted-foreground">Master 2</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Recent Courses</h2>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-3">
                      <span>Distributed Systems</span>
                      <Badge>A</Badge>
                    </div>

                    <div className="flex justify-between border-b pb-3">
                      <span>Cloud Computing</span>
                      <Badge>A+</Badge>
                    </div>

                    <div className="flex justify-between border-b pb-3">
                      <span>Network Security</span>
                      <Badge>B+</Badge>
                    </div>

                    <div className="flex justify-between">
                      <span>Machine Learning</span>
                      <Badge>A</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
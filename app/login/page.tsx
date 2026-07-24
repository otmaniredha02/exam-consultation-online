"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";
import { useState } from "react";
import './login.css';
import { pb } from '@/lib/database/pocketdb';
import { useRouter } from "next/navigation";
import { toast, Toaster } from "@/components/ui/toast";

export default function Login() {
    const [showpass,setShowpass] = useState(false);
    const router = useRouter();

    const handleLogin = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get("password") as string;
        // A robust regex to match any username followed by @stu.univ-saida.dz
        const regxstudentemail = /^[a-zA-Z0-9._%+-]+@stu\.univ-saida\.dz$/;
        // A robust regex to match any username followed by @univ-saida.dz
        const regxdentemail = /^[a-zA-Z0-9._%+-]+@univ-saida\.dz$/;

        if(password.length < 8) {
            toast.add({
                description:"password is too short.",
                type:'warning',
            });
            return;
        }

        if(regxstudentemail.test(email)) {
            let result = await pb.collection("students").authWithPassword(email,password)
            .then((r)=>{
                // TODO : store details in server
                console.log("logged in");
                router.push("/student");
            }).catch((e)=>{
                // TODO : store detaild logs onerror in server
                console.log(e);
                toast.add({
                    description:e.message,
                    type:'warning',
                });
                return;
            });
        } else if(regxdentemail.test(email)) {
            let result = await pb.collection("professor").authWithPassword(email,password)
             .then((r)=>{
                // TODO : store details in server
                console.log("logged in");
                router.push("/professor");
            }).catch((e)=>{
                // TODO : store detaild logs onerror in server
                console.log(e);
                toast.add({
                    description:e.message,
                    type:'warning',
                });
                return;
            });
        } else {
            toast.add({
                    description:"Invalid Email.",
                    type:'warning',
                });
            return;
        }
    }

    return (
        <>
        <Card className="logincard">
            <form onSubmit={handleLogin}>
                <h1 style={{fontSize:'2rem',display:'flex',justifyContent:'center'}}>
                    Consultaz
                </h1>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input placeholder="email" name="email" type="email"/>
                <br />
                <br />
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="logincardpassinput" style={{display:"flex"}}>
                    <Input name="password" style={{outline: 'none'}} placeholder="password" type={showpass ? "text" : "password"}/>
                    <Button style={{margin:'0.2rem',width : '1rem', height : '1rem'}} onClick={() => setShowpass((prev) => !prev)}>👁</Button>
                </div>
                <Button type="submit">Login</Button>
            </form>
            <Toaster/>
        </Card>
        
        </>
    );
}
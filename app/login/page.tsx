"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import './login.css';
import ParticlesBackground from "../components/backgrounds/ParticlesBackground";

export default function Login() {
    const [showpass,setShowpass] = useState(false);
    return (
        <>
        <Card className="logincard">
            <h1 style={{fontSize:'2rem',display:'flex',justifyContent:'center'}}>
                Consultaz
            </h1>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input placeholder="email" type="email"/>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div style={{display:"flex"}}>
                <Input style={{outline: 'none'}} placeholder="password" type={showpass ? "text" : "password"}/>
                <Button style={{backgroundColor:'white'}} onClick={() => setShowpass((prev) => !prev)}>👁</Button>
            </div>
            <Button>Login</Button>
        </Card>
        
        </>
    );
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Grading() {
    const [editmode,seteditmode] = useState(true);
    let exercice : string[] = ["exo1","exo2","exo1","exo2"];
    let questions : string[] = ["q1","q2","q3","q4"];
    const addExercice = () =>{

    }
    return (
        <div>
            <Input placeholder="add exercice" onClick={addExercice}/>

            {exercice.map((ex:string)=>{
                return  (
                <div>
                    
                    <p>{ex}</p>
                    <div style={{display:'grid',gridTemplateColumns:'70% 15%', gap: '1rem'}}>
                    <Input placeholder="question name"/>
                    <Input placeholder="pts" type="number"/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Button onClick={(e)=>{
                        e.preventDefault()
                        seteditmode(!editmode)}}>edit</Button>
                          {questions.map((q)=>  {
                                return !editmode ?  <p>{q} pts 1</p>
                                :  <div style={{display:'grid',gridTemplateColumns:'90% 30%', gap: '1rem'}}>
                                        <Input placeholder="question name" value={"sss"}/>
                                        <Input placeholder="pts" type="number" value={1}/>
                                    </div>
                            })}
                    </div>
                </div>
                </div>
                );
            })}
        </div>
    );
}
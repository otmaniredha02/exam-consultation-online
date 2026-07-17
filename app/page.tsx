"use client";
import '@/app/landingpage.css';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import ParticlesBackground from './components/backgrounds/ParticlesBackground';

export default function Home() {  
  return (
    <div>
      <ParticlesBackground/>
     <div className='landingpageheader'>
       <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink style={{padding:'20px'}}  render={<a href="/">Home</a>} />
            </NavigationMenuItem>
             <NavigationMenuItem>
              <NavigationMenuLink   style={{padding:'20px'}} render={<a href="/about">about</a>} />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button  style={{padding:'20px'}} variant="default">Login</Button>
            </NavigationMenuItem>
          </NavigationMenuList>
      </NavigationMenu>
    </div>
    <div className='bigtitlesection'> 
      <h1>Exam consulation online 
        <br/>
          for universities</h1>
    </div>
    </div>
  );
}

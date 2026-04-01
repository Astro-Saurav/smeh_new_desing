"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Mail, Phone, Send, ArrowUpRight, Globe, MessageSquare, Newspaper } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const departments = [
    { title: "Newsroom & Editorial", email: "news@manavrachnatimes.com", description: "Submit news tips, scoops, and campus stories directly to our editors." },
    { title: "Manav Rachna TV", href: "#", description: "Technical inquiries regarding digital broadcast and studio bookings." },
    { title: "PR & Advertising", email: "media.relations@mriirs.edu.in", description: "Collaboration requests, corporate relations, and advertising sponsorships." },
    { title: "Technical Support", description: "Inquiries regarding website stability, digital archives, and user access." }
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Editorial Header */}
      <div className="bg-zinc-50 border-b border-zinc-100 py-16 md:py-24 mb-12">
        <div className="container mx-auto px-4 md:px-8">
           <div className="flex items-center gap-3 mb-8">
              <span className="w-12 h-[2px] bg-primary" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Global Desk</span>
           </div>
           <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">
             The NEWSROOM <br />
             <span className="text-primary italic">Contact</span>
           </h1>
           <p className="text-zinc-500 text-lg md:text-xl font-medium mt-8 max-w-2xl leading-relaxed">
             Direct access to the School of Media and Humanities. Connect with our dedicated desks for story tips, academic inquiries, or technical support.
           </p>
        </div>
      </div>

      <main className="container mx-auto px-4 md:px-8 pb-32">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Main Contact Form */}
          <div className="lg:col-span-7 space-y-16">
            <div className="bg-white p-0 md:p-12 border-0 md:border border-zinc-100">
               <div className="mb-12 border-b border-zinc-100 pb-10">
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-950 mb-4 flex items-center gap-3">
                     <Newspaper className="w-4 h-4 text-primary" /> Send a Professional Brief
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-lg">Outline your inquiry with precision. Our editorial desk reviews all verified submissions within 24 operational hours.</p>
               </div>
               
               <form className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-950">Full Name</Label>
                        <Input className="rounded-none border-0 border-b-2 border-zinc-100 focus:border-primary focus:ring-0 transition-all px-0 h-10 text-base placeholder:text-zinc-300" placeholder="e.g. Rahul Sharma" />
                     </div>
                     <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-950">Professional Email</Label>
                        <Input className="rounded-none border-0 border-b-2 border-zinc-100 focus:border-primary focus:ring-0 transition-all px-0 h-10 text-base placeholder:text-zinc-300" type="email" placeholder="rahul@example.com" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-950">Subject / Department</Label>
                     <Input className="rounded-none border-0 border-b-2 border-zinc-100 focus:border-primary focus:ring-0 transition-all px-0 h-10 text-base placeholder:text-zinc-300" placeholder="e.g. Story Tip, Admissions Query" />
                  </div>
                  <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-950">Detailed Message</Label>
                     <Textarea className="rounded-none border-0 border-b-2 border-zinc-100 focus:border-primary focus:ring-0 transition-all px-0 min-h-[150px] text-base placeholder:text-zinc-300 resize-none" placeholder="Provide a comprehensive summary of your inquiry..." />
                  </div>
                  <Button className="rounded-none bg-zinc-950 hover:bg-primary text-white h-16 px-12 text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-xl w-full md:w-auto">
                     Dispatch Message <Send className="w-4 h-4 ml-4" />
                  </Button>
               </form>
            </div>

            {/* Specialized Departments */}
            <div className="space-y-10">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Section Desks</h3>
               <div className="grid md:grid-cols-2 gap-8">
                  {departments.map((dept, i) => (
                    <div key={i} className="group border border-zinc-100 p-8 hover:bg-zinc-50 transition-all duration-500 relative">
                       <h4 className="text-base font-black uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">{dept.title}</h4>
                       <p className="text-zinc-500 text-xs leading-relaxed mb-6">{dept.description}</p>
                       {dept.email && <span className="text-[10px] font-black text-zinc-400 italic underline tracking-wider">{dept.email}</span>}
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-5 space-y-16">
             <div className="sticky top-24 space-y-16">
                <div>
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-950 mb-10 pb-4 border-b-2 border-zinc-950 flex items-center gap-3">
                      <Globe className="w-4 h-4" /> Global Headquarters
                   </h3>
                   <div className="space-y-12">
                      <div className="flex gap-8">
                         <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-zinc-950" />
                         </div>
                         <div className="space-y-2">
                            <p className="font-black text-[10px] uppercase tracking-widest text-primary">Main Campus</p>
                            <p className="text-zinc-900 text-sm font-bold leading-relaxed">
                               Sector 43, Aravalli Hills,<br/>
                               Delhi - Surajkund Road, Faridabad, 121004
                            </p>
                         </div>
                      </div>
                      <div className="flex gap-8">
                         <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5 text-zinc-950" />
                         </div>
                         <div className="space-y-2">
                            <p className="font-black text-[10px] uppercase tracking-widest text-primary">Electronic Media</p>
                            <p className="text-zinc-900 text-sm font-bold italic underline">thefourthestate@manavrachna.com</p>
                         </div>
                      </div>
                      <div className="flex gap-8">
                         <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5 text-zinc-950" />
                         </div>
                         <div className="space-y-2">
                            <p className="font-black text-[10px] uppercase tracking-widest text-primary">Digital Helpline</p>
                            <p className="text-zinc-900 text-sm font-bold">+91-129-419-8100</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-zinc-950 text-white p-10 border-l-4 border-primary shadow-2xl">
                   <h4 className="text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-6">Support Desk</h4>
                   <h3 className="text-2xl font-black tracking-tighter leading-tight mb-8">Need Immediate Assistance?</h3>
                   <p className="text-zinc-400 text-sm leading-relaxed mb-10 font-medium font-serif italic">Our administrative support desk is available from 09:00 AM to 05:00 PM for all institutional queries.</p>
                   <Link href="/faq" className="w-full bg-primary text-white font-black uppercase text-[11px] tracking-widest py-4 hover:bg-white hover:text-zinc-950 transition-all flex items-center justify-center gap-3">
                      View Digital FAQ <ArrowUpRight className="w-4 h-4" />
                   </Link>
                </div>

                <div className="flex items-center gap-6 pt-10">
                   <div className="flex-1 h-px bg-zinc-100" />
                   <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Online & Active</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

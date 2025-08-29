
'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSchoolData } from "@/context/school-data-context";
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function TeamPage() {
    const { allSchoolData, isLoading } = useSchoolData();
    
    if (isLoading) {
        return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    
    const teamMembers = allSchoolData?.['northwood']?.profile?.teamMembers || [];

    return (
        <div className="container py-12 md:py-24 lg:py-32 space-y-12">
            <section className="text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Meet Our Team</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                    The passionate individuals driving the future of education.
                </p>
            </section>
            
            <section className="space-y-8">
              {teamMembers.map((member, index) => (
                <Card key={member.name} className="overflow-hidden">
                  <div className={`grid md:grid-cols-2 items-center ${index % 2 !== 0 ? 'md:grid-flow-col-dense' : ''}`}>
                    <div className={`order-1 ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                         <CardContent className="p-10">
                            <h3 className="text-2xl font-bold">{member.name}</h3>
                            <p className="text-primary font-semibold mt-1">{member.role}</p>
                            <p className="text-muted-foreground mt-4">{member.description}</p>
                        </CardContent>
                    </div>
                    <div className={`order-2 ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
                       <Image
                          src={member.imageUrl}
                          alt={member.name}
                          width={600}
                          height={600}
                          className="w-full h-full object-cover aspect-square"
                          data-ai-hint="person photo"
                        />
                    </div>
                  </div>
                </Card>
              ))}
              {teamMembers.length === 0 && (
                <p className="text-center text-muted-foreground py-10">Team member information has not been added yet.</p>
              )}
            </section>
        </div>
    );
}

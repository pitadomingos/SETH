
'use client';
import { useSchoolData } from '@/context/school-data-context';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Presentation, MapPin, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export default function ClassesPage() {
    const { role } = useAuth();
    const { classesData } = useSchoolData();
    const router = useRouter();

    if (role && role !== 'Admin') {
        router.push('/dashboard');
        return null;
    }
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Class Management</h2>
                    <p className="text-muted-foreground">Manage classes and class assignments.</p>
                </div>
                 <Button><UserPlus className="mr-2 h-4 w-4" />Create Class</Button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classesData.map((classItem) => (
                    <Card key={classItem.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>{classItem.name}</CardTitle>
                                <span className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">Grade {classItem.grade}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 flex-grow">
                            <div className="flex items-center text-muted-foreground">
                                <Presentation className="mr-3 h-4 w-4" />
                                <span>{classItem.teacher}</span>
                            </div>
                             <div className="flex items-center text-muted-foreground">
                                <Users className="mr-3 h-4 w-4" />
                                <span>{classItem.students} Students</span>
                            </div>
                             <div className="flex items-center text-muted-foreground">
                                <MapPin className="mr-3 h-4 w-4" />
                                <span>Room {classItem.room}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">View Details</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

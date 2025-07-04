
'use client';
import React, { useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
import { useSchoolData } from '@/context/school-data-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function WeeklyTimetable({ courses }) {
  const { teachersData, classesData } = useSchoolData();

  const getCourseForSlot = (day, time) => {
    return courses.find(course => 
      course.schedule.some(slot => 
        slot.day === day && slot.startTime <= time && slot.endTime > time
      )
    );
  };
  
  if (courses.length === 0) {
    return (
       <CardContent>
        <p className="text-center text-muted-foreground py-10">
          Your schedule is empty. Courses may not be assigned yet.
        </p>
      </CardContent>
    );
  }

  return (
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[auto_repeat(5,minmax(120px,1fr))] text-sm text-center">
          <div className="sticky left-0 bg-background z-10 p-2 border-b border-r"></div>
          {daysOfWeek.map(day => (
            <div key={day} className="p-2 font-semibold border-b">
              {day}
            </div>
          ))}

          {timeSlots.map(time => (
            <React.Fragment key={time}>
              <div className="sticky left-0 bg-background z-10 p-2 font-semibold border-b border-r h-24 flex items-center justify-center">
                {time}
              </div>
              {daysOfWeek.map(day => {
                const course = getCourseForSlot(day, time);
                const slotInfo = course?.schedule.find(s => s.day === day && s.startTime <= time && s.endTime > time);

                // To avoid rendering the same course in every slot it spans, we only render it at its start time.
                if (course && slotInfo && slotInfo.startTime === time) {
                  const teacher = teachersData.find(t => t.id === course.teacherId);
                  const classSection = classesData.find(c => c.id === course.classId);
                  
                  // Calculate how many time slots the course spans
                  const start = timeSlots.indexOf(slotInfo.startTime);
                  const end = timeSlots.indexOf(slotInfo.endTime);
                  const span = end > start ? end - start : 1;

                  return (
                    <div
                      key={`${day}-${time}`}
                      className="p-2 border-b border-r"
                      style={{ gridRow: `span ${span}` }}
                    >
                      <div className="bg-primary/10 text-primary-foreground p-2 rounded-md h-full text-left flex flex-col justify-between">
                          <div>
                            <p className="font-bold text-primary">{course.subject}</p>
                            <p className="text-xs text-primary/80">{teacher?.name}</p>
                            <p className="text-xs text-primary/80">{classSection?.name}</p>
                          </div>
                          <p className="text-xs text-primary/80 text-right font-medium">Room {slotInfo.room}</p>
                      </div>
                    </div>
                  );
                } else if (course) {
                  // This slot is covered by a multi-hour course but is not the starting slot, so we render nothing to let the previous cell span over it.
                   return null;
                } else {
                  // Empty slot
                  return <div key={`${day}-${time}`} className="border-b border-r h-24"></div>;
                }
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </CardContent>
  );
}

export default function SchedulePage() {
  const { role, user, isLoading: authLoading } = useAuth();
  const { coursesData, teachersData, studentsData, classesData, isLoading: dataLoading } = useSchoolData();

  const isLoading = authLoading || dataLoading;
  
  const studentIdMap = { student1: 'S001', student2: 'S101', student3: 'S201', student4: 'S010', };

  const userCourses = useMemo(() => {
    if (!user || isLoading) return [];
    
    if (role === 'Teacher') {
      const teacher = teachersData.find(t => t.name === user.name);
      if (!teacher) return [];
      return coursesData.filter(c => c.teacherId === teacher.id);
    }

    if (role === 'Student') {
      const studentId = user.username ? studentIdMap[user.username] : null;
      if (!studentId) return [];
      const studentInfo = studentsData.find(s => s.id === studentId);
      if (!studentInfo) return [];
      const studentClass = classesData.find(c => c.grade === studentInfo.grade && c.name.split('-')[1].trim() === studentInfo.class);
      if (!studentClass) return [];
      return coursesData.filter(c => c.classId === studentClass.id);
    }
    
    return [];
  }, [role, user, coursesData, teachersData, studentsData, classesData, isLoading]);

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Weekly Timetable</h2>
        <p className="text-muted-foreground">Your detailed course schedule for the week.</p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Schedule</CardTitle>
          <CardDescription>
            {role === 'Admin' 
              ? 'As an Administrator, you can create courses in the Academics section. Schedules for teachers and students will be displayed here based on those courses.' 
              : 'A view of your recurring weekly classes.'}
          </CardDescription>
        </CardHeader>
        {role !== 'Admin' && <WeeklyTimetable courses={userCourses} />}
      </Card>
    </div>
  );
}

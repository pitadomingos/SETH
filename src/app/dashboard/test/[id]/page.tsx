
'use client';

import { useSchoolData } from '@/context/school-data-context';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle, CheckCircle, BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function TakeTestPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAuth();
    const deployedTestId = params.id as string;
    const { deployedTests, savedTests, studentsData, isLoading: dataIsLoading } = useSchoolData();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { deployedTest, testInfo } = useMemo(() => {
        const dt = deployedTests.find(d => d.id === deployedTestId);
        const ti = dt ? savedTests.find(s => s.id === dt.testId) : undefined;
        return { deployedTest: dt, testInfo: ti };
    }, [deployedTests, savedTests, deployedTestId]);
    
    const studentId = useMemo(() => studentsData.find(s => s.email === user?.email)?.id, [studentsData, user]);

    const form = useForm();
    const { control, handleSubmit } = form;

    async function onSubmit(data: Record<string, string>) {
        if (!studentId) {
            toast({ variant: 'destructive', title: "Error", description: "Could not identify student."});
            return;
        }
        setIsSubmitting(true);
        // This is a placeholder since the AI grading action was removed.
        // In a real app without AI, you'd save the submission and mark it for manual grading.
        setTimeout(() => {
            toast({ title: "Test Submitted!", description: "Your answers have been saved for grading." });
            router.push('/dashboard');
            setIsSubmitting(false);
        }, 1000);
    }

    if (dataIsLoading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!deployedTest || !testInfo) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <h1 className="text-2xl font-bold">Test Not Found</h1>
                <p className="text-muted-foreground">This test may not exist or is no longer available.</p>
                <Button onClick={() => router.push('/dashboard')} className="mt-4">Return to Dashboard</Button>
            </div>
        );
    }
    
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-3xl">{testInfo.topic}</CardTitle>
                            <CardDescription className="text-base">{testInfo.subject} - {testInfo.gradeLevel}</CardDescription>
                        </div>
                        <div className="text-right">
                            <Badge variant="destructive">Due {formatDistanceToNow(new Date(deployedTest.deadline), { addSuffix: true })}</Badge>
                        </div>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-8">
                        {testInfo.questions.map((q, index) => (
                            <div key={index} className="space-y-3 border-t pt-6">
                                <p className="font-semibold text-lg">{index + 1}. {q.questionText}</p>
                                <Controller
                                    name={String(index)}
                                    control={control}
                                    rules={{ required: "Please select an answer."}}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2">
                                                {q.options.map((option, optionIndex) => (
                                                    <div key={optionIndex} className="flex items-center space-x-3 p-3 rounded-md border has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                                        <RadioGroupItem value={option} id={`q${index}-o${optionIndex}`} />
                                                        <Label htmlFor={`q${index}-o${optionIndex}`} className="flex-1 cursor-pointer">
                                                            {option}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                            {fieldState.error && <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>}
                                        </>
                                    )}
                                />
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Submit Test
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

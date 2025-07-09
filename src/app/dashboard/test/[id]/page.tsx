
'use client';

import { useSchoolData } from '@/context/school-data-context';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useForm, Controller } from 'react-hook-form';
import { gradeStudentTestAndSave } from '@/app/actions/grade-test-action';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle, CheckCircle, BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { type GradeStudentTestOutput } from '@/ai/flows/grade-student-test';

export default function TakeTestPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAuth();
    const deployedTestId = params.id as string;
    const { deployedTests, savedTests, studentsData, isLoading: dataIsLoading } = useSchoolData();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<GradeStudentTestOutput | null>(null);

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
        try {
            const scoreData = await gradeStudentTestAndSave({
                deployedTestId,
                studentId,
                studentAnswers: data,
            });

            if (scoreData) {
                setResult(scoreData);
                toast({ title: "Test Submitted!", description: "Your score has been calculated by our AI." });
            } else {
                throw new Error("Failed to get score from the server.");
            }
        } catch (error) {
            console.error("Submission error", error);
            toast({ variant: 'destructive', title: "Submission Failed", description: "There was an error submitting your test. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
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
    
    if (result) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <Card className="w-full max-w-lg text-center animate-in fade-in-50">
                    <CardHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="mt-4">Test Submitted Successfully!</CardTitle>
                        <CardDescription>Your results have been graded by our AI and saved to your profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-4xl font-bold text-primary">{result.score.toFixed(1)} / 20</div>
                        <p className="text-muted-foreground">You answered {result.correctCount} out of {result.totalQuestions} questions correctly.</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => router.push('/dashboard')} className="w-full">
                            Back to Dashboard
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
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
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                            Submit for AI Grading
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

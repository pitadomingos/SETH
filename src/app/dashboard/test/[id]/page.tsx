
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useSchoolData, DeployedTest, SavedTest, Student, Class } from '@/context/school-data-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

export default function TakeTestPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { deployedTests, savedTests, studentsData, addGrade, addTestSubmission } = useSchoolData();
    const { toast } = useToast();
    const form = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const testId = params.id as string;

    const [testData, setTestData] = useState<{ deployed: DeployedTest | undefined, saved: SavedTest | undefined }>({ deployed: undefined, saved: undefined});

    useEffect(() => {
        const deployed = deployedTests.find(t => t.id === testId);
        const saved = savedTests.find(t => t.id === deployed?.testId);
        setTestData({ deployed, saved });
    }, [testId, deployedTests, savedTests]);

    const { deployed, saved } = testData;

    const handleSubmit = (data: any) => {
        if (!deployed || !saved || !user) return;
        setIsSubmitting(true);

        let score = 0;
        saved.questions.forEach((q, index) => {
            const studentAnswer = data[`question_${index}`];
            if (studentAnswer === q.correctAnswer) {
                score++;
            }
        });

        const percentage = (score / saved.questions.length) * 100;
        const gradeOutOf20 = (percentage / 100) * 20;
        
        const student = studentsData.find(s => s.email === user.email);
        if(student) {
            // Record the submission to prevent re-taking the test
            addTestSubmission(deployed.id, student.id, score);
            
            // Add the grade to the gradebook
            addGrade({
                studentId: student.id,
                subject: saved.subject,
                grade: String(gradeOutOf20),
                type: 'Test',
                description: `AI Test: ${saved.topic}`,
            });
        }

        toast({
            title: `Test Submitted!`,
            description: `You scored ${score}/${saved.questions.length} (${percentage.toFixed(0)}%). Your grade has been recorded.`,
        });

        setTimeout(() => {
            router.push('/dashboard');
        }, 2000);
    };

    if (!deployed || !saved) {
        return (
            <div className="flex h-full items-center justify-center">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader><CardTitle>Test Not Found</CardTitle></CardHeader>
                    <CardContent><p>The test you are looking for does not exist or is no longer available.</p></CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-3xl py-8 animate-in fade-in-50">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">{saved.topic}</CardTitle>
                    <CardDescription>
                        A test in {saved.subject} for Grade {saved.grade}. Please answer all questions to the best of your ability.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <CardContent className="space-y-8">
                        {saved.questions.map((q, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                                <p className="font-semibold mb-4">{index + 1}. {q.question}</p>
                                <RadioGroup
                                    onValueChange={(value) => form.setValue(`question_${index}`, value)}
                                    className="space-y-2"
                                >
                                    {q.options.map((opt, i) => (
                                        <div key={i} className="flex items-center space-x-2">
                                            <RadioGroupItem value={opt} id={`q${index}-opt${i}`} />
                                            <Label htmlFor={`q${index}-opt${i}`}>{opt}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Submit Test
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}


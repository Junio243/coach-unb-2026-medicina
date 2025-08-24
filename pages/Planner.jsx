import React, { useState } from 'react';
import { generateStudyPlan } from "../services/geminiService.js";
import Button from '../components/ui/Button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card.jsx';

const Planner = () => {
    const [plan, setPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGeneratePlan = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateStudyPlan();
            setPlan(result);
        } catch (err) {
            setError('Falha ao gerar o plano. Verifique sua chave de API e tente novamente.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Planejador de Estudos com IA</CardTitle>
                    <CardDescription>Gere um plano de estudos semanal personalizado com base no seu perfil e nos pesos de Medicina para a UnB.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleGeneratePlan} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <SpinnerIcon />
                                Gerando...
                            </>
                        ) : 'Gerar Plano Semanal'}
                    </Button>
                    {error && <p className="mt-4 text-red-500">{error}</p>}
                </CardContent>
            </Card>

            {plan && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
                    {Object.entries(plan).map(([day, blocks]) => (
                        <div key={day} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                            <h3 className="font-bold text-center capitalize mb-3">{day}</h3>
                            <div className="space-y-2">
                                {Array.isArray(blocks) && blocks.map(block => (
                                    <div key={block.id} className={`p-2 rounded text-xs ${block.type === 'study' ? 'bg-indigo-100 dark:bg-indigo-900' : block.type === 'review' ? 'bg-green-100 dark:bg-green-900' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                        <p className="font-semibold">{block.subject}</p>
                                        <p>{block.topic}</p>
                                        <p className="text-slate-500">{block.startTime} - {block.endTime}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default Planner;

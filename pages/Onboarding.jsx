import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import Button from '../components/ui/Button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card.jsx';

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useStore();
  const [step, setStep] = useState(1);
  
  const handleFinish = () => {
    // In a real app, you would collect all the data into the profile state.
    // This is a simplified version.
    const finalProfile = {
        availability: { monday: [{ start: "09:00", end: "12:00"}] },
        strengths: ["Biologia", "Química"],
        weaknesses: ["Física", "Matemática"],
    };
    completeOnboarding(finalProfile);
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-800">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Bem-vindo ao Coach UnB!</CardTitle>
          <CardDescription>Vamos personalizar sua preparação. (Passo {step} de 3)</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && <div>Conteúdo para Disponibilidade Semanal</div>}
          {step === 2 && <div>Conteúdo para Forças/Fraquezas</div>}
          {step === 3 && <div>Conteúdo para Preferências Sensoriais</div>}
          
          <div className="flex justify-between mt-8">
            {step > 1 && <Button variant="outline" onClick={() => setStep(s => s - 1)}>Anterior</Button>}
            <div className="flex-grow"></div>
            {step < 3 && <Button onClick={() => setStep(s => s + 1)}>Próximo</Button>}
            {step === 3 && <Button onClick={handleFinish}>Concluir e Começar!</Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
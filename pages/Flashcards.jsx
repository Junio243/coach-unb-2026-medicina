import React from 'react';
import Button from '../components/ui/Button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card.jsx';

const Flashcards = () => {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Flashcards com Repetição Espaçada</CardTitle>
                    <CardDescription>Revise os principais tópicos com o algoritmo SM-2 para otimizar a memorização.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button>Iniciar Sessão de Revisão</Button>
                     <p className="mt-4 text-slate-500">
                        Funcionalidade em desenvolvimento. Aqui, você terá acesso à sua biblioteca de flashcards,
                        poderá importar/exportar baralhos e estudar com o sistema de repetição espaçada.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Flashcards;
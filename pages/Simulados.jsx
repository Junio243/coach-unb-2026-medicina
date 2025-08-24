import React from 'react';
import Button from '../components/ui/Button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card.jsx';

const Simulados = () => {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Gerador de Simulados Estilo Cebraspe</CardTitle>
                    <CardDescription>Crie simulados personalizados por disciplina, tempo e número de itens.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        {/* Configuration options would go here */}
                        <Button>Gerar Simulado</Button>
                    </div>
                     <p className="mt-4 text-slate-500">
                        Funcionalidade em desenvolvimento. Aqui, você poderá gerar simulados com IA,
                        responder questões com cronômetro, e receber um relatório detalhado de performance.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Simulados;
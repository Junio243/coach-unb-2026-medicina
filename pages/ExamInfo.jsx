import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card.jsx';
import blueprint from '../data/blueprint-unb-2026.json' assert { type: 'json' };
import datas from '../data/datas.json' assert { type: 'json' };

const ExamInfo = () => {
    return (
        <div className="space-y-6">
            <Card className="bg-yellow-50 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700">
                <CardHeader>
                    <CardTitle>Aviso Importante</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>As informações abaixo são baseadas em editais anteriores e podem mudar. Sempre confira o edital vigente publicado pelo Cebraspe para o Vestibular UnB 2026.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Datas Importantes (Estimativa)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Publicação do Edital:</strong> {datas.edital}</li>
                        <li><strong>Período de Inscrição:</strong> {datas.inscricao}</li>
                        <li><strong>Data da Prova:</strong> {datas.prova}</li>
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Estrutura da Prova</CardTitle>
                    <CardDescription>{blueprint.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {blueprint.provas.map(prova => (
                        <div key={prova.id}>
                            <h3 className="text-xl font-semibold">{prova.nome}</h3>
                            <p><strong>Itens:</strong> {prova.itens}</p>
                            <p><strong>Disciplinas:</strong> {prova.disciplinas.join(', ')}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default ExamInfo;
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.jsx';

const studyData = [
  { name: 'Seg', estudado: 4, meta: 5 },
  { name: 'Ter', estudado: 3, meta: 4 },
  { name: 'Qua', estudado: 5, meta: 5 },
  { name: 'Qui', estudado: 4.5, meta: 4 },
  { name: 'Sex', estudado: 6, meta: 6 },
  { name: 'Sáb', estudado: 8, meta: 8 },
  { name: 'Dom', estudado: 2, meta: 3 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Tempo de Estudo (Semana)</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="estudado" fill="#4f46e5" name="Horas Estudadas" />
                <Bar dataKey="meta" fill="#a5b4fc" name="Meta de Horas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Próxima Atividade</CardTitle></CardHeader>
            <CardContent>
                <p className="text-lg font-semibold">Revisão de Biologia Celular</p>
                <p className="text-slate-500">Hoje, às 15:00</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Streak Semanal</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center">
                 <span className="text-6xl font-bold text-indigo-600">5</span>
                 <span className="ml-2 text-lg text-slate-500">dias</span>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
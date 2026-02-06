'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Activity } from 'lucide-react';
import { useMemo } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

interface ActivityChartProps {
    data: { date: string; count: number }[];
}

export function ActivityChart({ data }: ActivityChartProps) {
    const maxValue = Math.max(...data.map(d => d.count), 1);
    const chartData = useMemo(() => {
        const labels = data.map(d => {
            const date = new Date(d.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        });
        const values = data.map(d => d.count);

        return {
            labels,
            datasets: [
                {
                    label: 'Transactions',
                    data: values,
                    fill: true,
                    backgroundColor: 'rgba(26, 115, 255, 0.15)',
                    borderColor: '#1A73FF',
                    pointBackgroundColor: '#1A73FF',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#1A73FF', // Neon accent
                    tension: 0.4, // Smooth curve
                },
            ],
        };
    }, [data]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#0B0B0B',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                titleSpacing: 6,
                cornerRadius: 10,
                callbacks: {
                    title: (items: any) => {
                        const raw = items?.[0]?.label;
                        if (!raw) return '';
                        return `Date ${raw}`;
                    },
                    label: (context: any) => `${context.parsed.y} transactions`,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: '#888',
                    font: {
                        size: 10,
                    },
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 7,
                },
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#888',
                    font: {
                        size: 10,
                    },
                    precision: 0,
                    stepSize: 1,
                },
                beginAtZero: true,
                suggestedMax: maxValue,
            },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
    };

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[180px] text-muted text-sm gap-2">
                <Activity className="h-5 w-5 text-primary/70" />
                No activity yet
            </div>
        );
    }

    return (
        <div className="w-full h-[180px] md:h-[240px]">
            <Line options={options} data={chartData} />
        </div>
    );
}

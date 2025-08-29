"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type MetricType = 'visitors' | 'pageviews';

interface LineChartProps {
    chartData: AnalyticsChartPoint[];
    metricType: MetricType;
}

export function LineChart({ metricType = "visitors", chartData }: LineChartProps) {
    const dataKey = metricType;
    
    const formatNumber = (value: number) => {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M'
        }
        if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K'
        }
        return value.toString()
    };

    // Calculate max value for Y-axis width
    const maxValue = Math.max(...chartData.map((item) => 
        metricType === "visitors" ? item.visitors : item.pageviews
    ));
    const formattedMax = formatNumber(maxValue);
    const yAxisWidth = formattedMax.length * 8;

    return (
        <div className="w-full h-full [&_*]:outline-none [&_*]:focus:outline-none">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 5, left: 0, bottom: 14 }}
                >
                    <defs>
                        <linearGradient id="fillChart" x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="5%"
                                stopColor="var(--primary)"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="var(--primary)"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        vertical={false}
                        stroke="rgba(255, 255, 255, 0.075)"
                    />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}
                        tickMargin={20}
                        minTickGap={32}
                        tickFormatter={(value) => {
                            const date = new Date(value)
                            return date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })
                        }}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}
                        width={yAxisWidth}
                        tickFormatter={(value) => formatNumber(value)}
                    />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                                        <p className="text-foreground font-medium">{new Date(label).toLocaleDateString()}</p>
                                        <p className="text-primary">
                                            {metricType === 'visitors' ? 'Visitors' : 'Page Views'}: {payload[0].value?.toLocaleString()}
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                        cursor={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    <Area
                        dataKey={dataKey}
                        type="monotone"
                        fill="url(#fillChart)"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        activeDot={{ fill: '#FFFFFF', r: 5 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
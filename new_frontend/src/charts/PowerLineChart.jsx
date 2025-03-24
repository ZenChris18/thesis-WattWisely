import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function PowerLineChart({ data, selectedTimeframe }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return; // Ensure canvas exists

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    const groupByTime = (data, intervalMs) => {
      const groupedData = [];
      let lastTime = null;

      data.forEach((entry) => {
        const entryTime = new Date(entry.time).getTime();

        if (!lastTime || entryTime - lastTime >= intervalMs) {
          groupedData.push(entry);
          lastTime = entryTime;
        }
      });

      return groupedData;
    };

    const INTERVALS = {
      'Past Hour': 5 * 60 * 1000,
      'Past Day': 30 * 60 * 1000,
      'Past Week': 3 * 60 * 60 * 1000,
    };

    const groupedData = groupByTime(data, INTERVALS[selectedTimeframe] || 30 * 60 * 1000);

    const filteredLabels = groupedData.map((d) =>
      new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );

    const filteredValues = groupedData.map((d) => d.value);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: filteredLabels,
        datasets: [
          {
            label: 'Power Usage (W)',
            data: filteredValues,
            borderColor: '#4F46E5',
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            fill: true,
            tension: 0.4,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 10 },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (tooltipItem) => `${tooltipItem.raw} W` },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Power (W)' },
          },
          x: {
            ticks: {
              autoSkip: true,
              maxRotation: 0,
              minRotation: 0,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [data, selectedTimeframe]);

  return <canvas ref={chartRef} className="w-full h-full"></canvas>;
}

export default PowerLineChart;

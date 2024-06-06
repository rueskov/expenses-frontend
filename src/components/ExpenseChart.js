import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpenseChart = ({ expenses }) => {
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(expense);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(groupedExpenses),
    datasets: [
      {
        label: 'Amount',
        data: Object.values(groupedExpenses).map((expenses) =>
          expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
        ),
        backgroundColor: 'rgba(0, 68, 204, 0.6)',
        borderColor: 'rgba(0, 68, 204, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Monthly Expenses</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ExpenseChart;

import React, { useState } from 'react';
import { createExpense } from '../api';

const ExpenseForm = ({ onExpenseAdded }) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newExpense = { date, description, amount };
      const response = await createExpense(newExpense);
      onExpenseAdded(response);
      setDate('');
      setDescription('');
      setAmount('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Expense</h2>
      <div>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div>
        <label>Description:</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
      <button type="submit">Add Expense</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default ExpenseForm;

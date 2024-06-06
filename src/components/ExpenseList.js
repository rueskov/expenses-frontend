import React, { useState, useEffect } from 'react';
import { deleteExpense } from '../api';

const ExpenseList = ({ expenses, onExpenseDeleted, onExpenseEdited, setEditingExpense, editingExpense }) => {
  const [editFormData, setEditFormData] = useState({
    date: '',
    description: '',
    amount: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingExpense) {
      setEditFormData({
        date: editingExpense.date || '',
        description: editingExpense.description || '',
        amount: editingExpense.amount || '',
      });
    }
  }, [editingExpense]);

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      onExpenseDeleted(id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setEditFormData({
      date: expense.date || '',
      description: expense.description || '',
      amount: expense.amount || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingExpense) {
      console.error("No expense to edit");
      return;
    }

    try {
      const updatedExpense = { ...editingExpense, ...editFormData };
      await onExpenseEdited(editingExpense.id, updatedExpense);
      //setEditingExpense(null); // Ensure this is called to reset editing state
    } catch (err) {
      setError(err.message);
    }
  };

  if (editingExpense) {
    return (
      <form onSubmit={handleEditSubmit}>
        <h1>Modify expense</h1>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={editFormData.date}
            onChange={handleEditChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={editFormData.description}
            onChange={handleEditChange}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={editFormData.amount}
            onChange={handleEditChange}
            required
          />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={() => setEditingExpense(null)}>
          Cancel
        </button>
      </form>
    );
  }
 
  if (!expenses) {
    return
  }

  return (
    <div>
      <h2>Expense List</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            <label>Date:</label> <p>{expense.date}</p>
            <label>Amount:</label> <p>${expense.amount}</p>
            <label>Description:</label> <p>{expense.description}</p>
            <br></br>
            <button className='expenseList' onClick={() => handleEdit(expense)}>Edit</button>
            <button className='expenseList' onClick={() => handleDelete(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;

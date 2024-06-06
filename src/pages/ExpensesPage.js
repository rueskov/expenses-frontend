import React, { useState, useEffect, useContext, useCallback } from 'react';
import AuthContext from '../authContext';
import { useNavigate } from 'react-router-dom';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseChart from '../components/ExpenseChart';
import ThemeSwitcher from '../components/ThemeSwitcher';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const { isAuthenticated, loading, authAxios } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchExpenseData = useCallback(async () => {
    try {
      const response = await authAxios.get('/expenses');
      setExpenses(response.data);
    } catch (err) {
      setError("Failed to fetch expenses");
    }
  }, [authAxios]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else {
        fetchExpenseData();
      }
    }
  }, [isAuthenticated, loading, navigate, fetchExpenseData]);

  const handleExpenseAdded = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  const handleExpenseEdited = async (id, updatedData) => {
    try {
      const response = await authAxios.put(`/expenses/${id}/`, updatedData);
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === id ? response.data : expense
        )
      );
      setEditingExpense(null);
    } catch (err) {
      setError("Failed to update expense");
    }
  };

  const handleExpenseDeleted = (deletedExpenseId) => {
    setExpenses((prevExpenses) => prevExpenses.filter(expense => expense.id !== deletedExpenseId));
  };
  
  return (
    <div>
      <h1>Expenses</h1>
      <ThemeSwitcher />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ExpenseChart expenses={expenses} />
      {expenses.length > 0 && (
        <ExpenseList 
          expenses={expenses} 
          onExpenseDeleted={handleExpenseDeleted}
          onExpenseEdited={handleExpenseEdited}
          setEditingExpense={setEditingExpense}
          editingExpense={editingExpense} 
        />
      )}
      {!editingExpense && <ExpenseForm onExpenseAdded={handleExpenseAdded} />}
    </div>
  );
};

export default ExpensesPage;

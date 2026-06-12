import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { balancesAPI, expensesAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import { 
  Plus, 
  ChevronRight, 
  Utensils, 
  Car, 
  Hotel, 
  Film, 
  ShoppingBag, 
  Lightbulb, 
  Activity, 
  DollarSign 
} from 'lucide-react';
import AddExpenseModal from '../components/AddExpenseModal';

const CATEGORY_COLORS = {
  food: '#EE6C4D',         // orange-red
  transport: '#3D9BC1',    // blue
  accommodation: '#9B5DE5',// purple
  entertainment: '#F15BB5',// pink
  shopping: '#F4A261',     // sand orange
  utilities: '#00BBF9',    // light blue
  health: '#00F5D4',       // mint green
  other: '#888888'         // grey
};

const CATEGORY_ICONS = {
  food: <Utensils size={18} color="white" />,
  transport: <Car size={18} color="white" />,
  accommodation: <Hotel size={18} color="white" />,
  entertainment: <Film size={18} color="white" />,
  shopping: <ShoppingBag size={18} color="white" />,
  utilities: <Lightbulb size={18} color="white" />,
  health: <Activity size={18} color="white" />,
  other: <DollarSign size={18} color="white" />
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    try {
      const [bRes, eRes] = await Promise.all([
        balancesAPI.user(),
        expensesAPI.list({}),
      ]);
      setSummary(bRes.data);
      setExpenses(eRes.data.slice(0, 20));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  const totalOwed = summary?.total_owed_to_you || 0;
  const totalOwe = summary?.total_you_owe || 0;

  // Group expenses by month
  const grouped = {};
  expenses.forEach(exp => {
    const key = format(parseISO(exp.date), 'MMMM yyyy');
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(exp);
  });

  return (
    <div>
      {/* TOP BAR */}
      <div className="top-bar">
        <span className="top-bar-title">Dashboard</span>
        <div className="top-bar-actions">
          <button id="add-expense-btn" className="btn btn-teal btn-sm" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> Add expense
          </button>
        </div>
      </div>

      <div className="page-wrap">
        {/* BALANCE SUMMARY ROW */}
        <div className="summary-row" style={{ padding: 0, marginBottom: 24 }}>
          <div className="summary-box">
            <div className="summary-box-label">Total balance</div>
            <div className="summary-box-amount" style={{
              color: totalOwed - totalOwe > 0.01 ? '#1CC29F' : totalOwe - totalOwed > 0.01 ? '#E87722' : '#6c757d'
            }}>
              {totalOwed - totalOwe > 0.01
                ? `+₹${(totalOwed - totalOwe).toFixed(2)}`
                : totalOwe - totalOwed > 0.01
                  ? `-₹${(totalOwe - totalOwed).toFixed(2)}`
                  : '₹0.00'
              }
            </div>
          </div>
          <div className="summary-box">
            <div className="summary-box-label">You owe</div>
            <div className="summary-box-amount" style={{ color: totalOwe > 0.01 ? '#E87722' : '#6c757d' }}>
              {totalOwe > 0.01 ? `₹${totalOwe.toFixed(2)}` : '₹0.00'}
            </div>
          </div>
          <div className="summary-box">
            <div className="summary-box-label">You are owed</div>
            <div className="summary-box-amount" style={{ color: totalOwed > 0.01 ? '#1CC29F' : '#6c757d' }}>
              {totalOwed > 0.01 ? `₹${totalOwed.toFixed(2)}` : '₹0.00'}
            </div>
          </div>
        </div>

        {/* EXPENSE LIST */}
        {expenses.length === 0 ? (
          <div style={{ border: '1px solid #e9ecef', borderRadius: 12, background: 'white' }}>
            <div className="empty-state">
              <DollarSign size={48} color="#ccc" style={{ marginBottom: 14, display: 'inline-block' }} />
              <h3>No expenses yet</h3>
              <p>Add an expense to get started tracking balances</p>
              <button className="btn btn-teal" style={{ marginTop: 16 }} onClick={() => setShowAdd(true)}>
                <Plus size={15} /> Add expense
              </button>
            </div>
          </div>
        ) : (
          <div style={{ border: '1px solid #e9ecef', borderRadius: 12, background: 'white', overflow: 'hidden' }}>
            {Object.entries(grouped).map(([month, items]) => (
              <div key={month}>
                <div className="month-header">{month}</div>
                {items.map(expense => {
                  const mySplit = expense.splits?.find(s => s.user.id === user.id);
                  const iPaid = expense.paid_by?.id === user.id;
                  const iOwe = !iPaid && mySplit;
                  const theyOweMe = iPaid;
                  const myOwed = iOwe ? Number(mySplit.amount_owed) : 0;
                  const theyOweAmt = theyOweMe
                    ? (expense.splits || []).filter(s => s.user.id !== user.id).reduce((sum, s) => sum + Number(s.amount_owed), 0)
                    : 0;

                  return (
                    <div
                      key={expense.id}
                      className="expense-item"
                      onClick={() => navigate(`/expenses/${expense.id}`)}
                    >
                      {/* Date */}
                      <div className="expense-date-col">
                        <div className="expense-date-month">{format(parseISO(expense.date), 'MMM')}</div>
                        <div className="expense-date-day">{format(parseISO(expense.date), 'd')}</div>
                      </div>

                      {/* Category Icon */}
                      <div
                        className="expense-category-icon"
                        style={{ background: CATEGORY_COLORS[expense.category] || '#888888' }}
                      >
                        {CATEGORY_ICONS[expense.category] || <DollarSign size={18} color="white" />}
                      </div>

                      {/* Name + sub */}
                      <div className="expense-info">
                        <div className="expense-name">{expense.description}</div>
                        <div className="expense-sub">
                          {iPaid ? 'You paid' : `${expense.paid_by?.name} paid`} ₹{Number(expense.total_amount).toFixed(2)}
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="expense-amount-col">
                        {iOwe && (
                          <>
                            <div className="expense-you-borrowed">you borrowed</div>
                            <div className="expense-amount-orange">₹{myOwed.toFixed(2)}</div>
                          </>
                        )}
                        {theyOweMe && theyOweAmt > 0.01 && (
                          <>
                            <div className="expense-you-lent">you lent</div>
                            <div className="expense-amount-green">₹{theyOweAmt.toFixed(2)}</div>
                          </>
                        )}
                        {!iOwe && !theyOweMe && (
                          <div className="expense-settled">not involved</div>
                        )}
                        {theyOweMe && theyOweAmt <= 0.01 && (
                          <div className="expense-settled">settled</div>
                        )}
                      </div>

                      <ChevronRight size={16} color="#dee2e6" />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && <AddExpenseModal onClose={() => setShowAdd(false)} onSuccess={load} />}
    </div>
  );
}

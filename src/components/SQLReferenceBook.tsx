import React, { useState } from 'react';
import { BookOpen, X, Database, Filter, Calculator, Link, Layers, Activity } from 'lucide-react';

const SECTIONS = [
  { id: 'basics', title: '1. The Basics', icon: <Database size={16} /> },
  { id: 'filtering', title: '2. Filtering Data', icon: <Filter size={16} /> },
  { id: 'aggregations', title: '3. Aggregations', icon: <Calculator size={16} /> },
  { id: 'joins', title: '4. Joins', icon: <Link size={16} /> },
  { id: 'advanced', title: '5. Advanced Logic', icon: <Layers size={16} /> },
  { id: 'window', title: '6. Window Functions', icon: <Activity size={16} /> }
];

export function SQLReferenceBook({ onClose }: { onClose: () => void }) {
  const [activeSection, setActiveSection] = useState('basics');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px'
    }}>
      <div style={{
        width: '100%', maxWidth: '1200px', height: '100%',
        backgroundColor: '#0f172a', borderRadius: '16px',
        border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        fontFamily: 'var(--font-sans)', color: '#f8fafc'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '20px 30px', borderBottom: '1px solid #1e293b', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: '#0b1120'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen size={24} color="#38bdf8" />
            <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>PayPaySQL Survival Guide</h2>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', border: 'none', color: '#94a3b8', 
              cursor: 'pointer', padding: '8px', borderRadius: '50%' 
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Sidebar */}
          <div style={{ 
            width: '280px', borderRight: '1px solid #1e293b', 
            backgroundColor: '#0f172a', padding: '24px 16px', overflowY: 'auto' 
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', paddingLeft: '12px' }}>
              Chapters
            </div>
            {SECTIONS.map(section => (
              <div 
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  padding: '12px', borderRadius: '8px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  backgroundColor: activeSection === section.id ? '#1e293b' : 'transparent',
                  color: activeSection === section.id ? '#38bdf8' : '#94a3b8',
                  fontWeight: activeSection === section.id ? 600 : 400,
                  transition: 'all 0.2s ease', marginBottom: '4px'
                }}
              >
                {section.icon}
                {section.title}
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, backgroundColor: '#0b1120', padding: '40px 60px', overflowY: 'auto' }}>
            
            {activeSection === 'basics' && (
              <div className="prose">
                <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>1. The Basics</h1>
                <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '32px' }}>The foundation of every query.</p>
                
                <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', marginBottom: '32px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#f8fafc' }}>What is SQL?</h4>
                  <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.6 }}>SQL (Structured Query Language) is how we ask databases for information. Think of a database like a massive collection of Excel spreadsheets (called <strong>Tables</strong>). Every row is a record, and every column is a specific attribute.</p>
                </div>
                
                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>SELECT * (Select All)</h3>
                <p>Grabs every column and row from a table. Always use LIMIT to avoid crashing the database.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT * FROM merchants LIMIT 10;
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Selecting Specific Columns</h3>
                <p>Reduces noise by only returning the exact columns you ask for.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT name, country FROM merchants LIMIT 10;
                </code>
              </div>
            )}

            {activeSection === 'filtering' && (
              <div className="prose">
                <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>2. Filtering Data</h1>
                <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '32px' }}>Finding the exact cohort you need using the WHERE clause.</p>
                
                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Exact Match (=)</h3>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT * FROM merchants WHERE country = 'US';
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Exclusion (!=)</h3>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT * FROM merchants WHERE status != 'suspended';
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>List Match (IN)</h3>
                <p>Much cleaner than writing multiple OR statements.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT * FROM merchants WHERE country IN ('US', 'UK', 'CA');
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Combining Logic (AND / OR)</h3>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT * FROM merchants WHERE country = 'US' AND status = 'active';
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Pattern Search (ILIKE)</h3>
                <p>Case-insensitive search. Use `%` as a wildcard.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT * FROM merchants WHERE name ILIKE '%Corp%';
                </code>
              </div>
            )}

            {activeSection === 'aggregations' && (
              <div className="prose">
                <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>3. Aggregations</h1>
                <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '32px' }}>Calculating metrics, sums, and averages.</p>
                
                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Basic Math (SUM, AVG, COUNT)</h3>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT COUNT(*) as total_users FROM merchants;
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>GROUP BY</h3>
                <p>Splits your aggregates into buckets (like counting users *per country*).</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT country, COUNT(*) FROM merchants GROUP BY country;
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Date Grouping (DATE_TRUNC)</h3>
                <p>Rounds a timestamp down to the nearest month/day/hour to create time-series data.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT DATE_TRUNC('month', created_at), SUM(amount) FROM payments GROUP BY 1;
                </code>
              </div>
            )}

            {activeSection === 'joins' && (
              <div className="prose">
                <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>4. Joins</h1>
                <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '32px' }}>Connecting tables together.</p>
                
                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>INNER JOIN</h3>
                <p>Requires a match in BOTH tables. If a merchant has no payments, they disappear.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT m.name, p.amount FROM merchants m JOIN payments p ON m.id = p.merchant_id;
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>LEFT JOIN</h3>
                <p>Keeps ALL rows from the left table, even if there is no match on the right. Perfect for finding "Drop offs" (where right ID IS NULL).</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT m.name FROM merchants m LEFT JOIN payments p ON m.id = p.merchant_id WHERE p.id IS NULL;
                </code>
              </div>
            )}

            {activeSection === 'advanced' && (
              <div className="prose">
                <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>5. Advanced Logic</h1>
                <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '32px' }}>Subqueries, CTEs, and Business Logic.</p>
                
                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>CASE WHEN (If/Else)</h3>
                <p>Creates buckets dynamically.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  {"SELECT amount, CASE WHEN amount > 1000 THEN 'Large' ELSE 'Small' END as bucket FROM payments;"}
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Subqueries</h3>
                <p>A query inside a query.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  {"SELECT amount FROM payments WHERE amount > (SELECT AVG(amount) FROM payments);"}
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Common Table Expressions (WITH)</h3>
                <p>Breaks massive queries down into readable steps.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  WITH US_Merchants AS (SELECT * FROM merchants WHERE country = 'US') 
                  SELECT COUNT(*) FROM US_Merchants;
                </code>
              </div>
            )}

            {activeSection === 'window' && (
              <div className="prose">
                <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>6. Window Functions</h1>
                <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '32px' }}>The PM superpower for running totals, leaderboards, and MoM growth.</p>
                
                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Rolling Totals (OVER PARTITION BY)</h3>
                <p>Calculates aggregates alongside raw row data.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT amount, SUM(amount) OVER (PARTITION BY merchant_id) FROM payments;
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Leaderboards (RANK / ROW_NUMBER)</h3>
                <p>Assigns a rank to each row within a partition. RANK() gives ties the same number. ROW_NUMBER() forces a unique number for every row.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px', marginBottom: '12px' }}>
                  SELECT name, RANK() OVER (PARTITION BY country ORDER BY created_at DESC) FROM merchants;
                </code>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT amount, ROW_NUMBER() OVER (ORDER BY amount DESC) FROM payments;
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Month-over-Month (LAG / LEAD)</h3>
                <p>Looks at the previous row's value (LAG) or the next row's value (LEAD) to calculate growth or time between events.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT month, total_fees, LAG(total_fees) OVER (ORDER BY month) FROM invoices;
                </code>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

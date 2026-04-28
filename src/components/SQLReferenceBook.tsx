import React, { useState } from 'react';
import { BookOpen, X, Database, Filter, Calculator, Link, Layers, Activity } from 'lucide-react';

const SECTIONS = [
  { id: 'mindset', title: '0. PM Mindset', icon: <Activity size={16} /> },
  { id: 'basics', title: '1. The Basics', icon: <Database size={16} /> },
  { id: 'filtering', title: '2. Filtering Data', icon: <Filter size={16} /> },
  { id: 'aggregations', title: '3. Aggregations', icon: <Calculator size={16} /> },
  { id: 'joins', title: '4. Joins', icon: <Link size={16} /> },
  { id: 'logic', title: '5. Business Logic', icon: <Layers size={16} /> },
  { id: 'advanced', title: '6. Power Tools', icon: <Database size={16} /> },
  { id: 'window', title: '7. Analysis Pro', icon: <Activity size={16} /> },
  { id: 'funnels', title: '8. PM Funnels', icon: <Filter size={16} /> }
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
            
            {activeSection === 'mindset' && (
              <div className="prose">
                <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>The PM Mindset</h1>
                <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '32px' }}>Why PMs should learn SQL instead of waiting for a dashboard.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                  <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#38bdf8', marginBottom: '8px' }}>Speed to Insight</h4>
                    <p style={{ fontSize: '14px', color: '#cbd5e1' }}>Don't wait 2 days for a Data Analyst to answer "How many users dropped off?". Find out in 2 minutes.</p>
                  </div>
                  <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#38bdf8', marginBottom: '8px' }}>Data Literacy</h4>
                    <p style={{ fontSize: '14px', color: '#cbd5e1' }}>Understand the "logic" of your product. If you know the tables, you know how your feature actually works.</p>
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', color: '#f8fafc', marginBottom: '16px' }}>The Core Strategy</h3>
                <ol style={{ color: '#94a3b8', lineHeight: 1.8 }}>
                  <li><strong>Start Small</strong>: Don't try to join 10 tables. Start with one.</li>
                  <li><strong>Use LIMIT</strong>: Databases are expensive. Always limit your results while testing.</li>
                  <li><strong>Verify with UI</strong>: Check if the number you get in SQL matches what you see in the admin dashboard.</li>
                </ol>
              </div>
            )}

            {activeSection === 'basics' && (
              <div className="prose">
                <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>1. The Basics</h1>
                <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '32px' }}>The database is just a collection of smart spreadsheets.</p>
                
                <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', marginBottom: '32px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#f8fafc' }}>Mental Model</h4>
                  <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.6 }}>Think of a database like an Excel workbook. <br />
                  • <strong>Table</strong> = A single Sheet (e.g. "Orders") <br />
                  • <strong>Column</strong> = A Column in Excel (e.g. "Price") <br />
                  • <strong>Row</strong> = One specific record (e.g. "Order #123")</p>
                </div>
                
                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>The "Hello World" of SQL</h3>
                <p>Grabs everything from the table. Use <code>LIMIT 10</code> to just see a sample.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT * FROM merchants LIMIT 10;
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Selecting Only What You Need</h3>
                <p>Avoid "Data Overload". Only ask for the specific columns you are analyzing.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT name, country, created_at FROM merchants;
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
                <p>Requires a match in BOTH tables. If a merchant has no payments, they disappear from your list.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT m.name, p.amount FROM merchants m JOIN payments p ON m.id = p.merchant_id;
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>LEFT JOIN</h3>
                <p>Keeps ALL rows from the left table. This is the PM's best friend for finding drop-offs.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  SELECT m.name FROM merchants m LEFT JOIN payments p ON m.id = p.merchant_id;
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>SELF JOIN</h3>
                <p>Joining a table to itself. Use this to compare different rows in the same spreadsheet, like finding a user's "Previous Order" or "Next Order".</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  {"SELECT p1.id, p2.id FROM payments p1 JOIN payments p2 ON p1.user_id = p2.user_id WHERE p1.id != p2.id;"}
                </code>
              </div>
            )}

            {activeSection === 'logic' && (
              <div className="prose">
                <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>5. Business Logic</h1>
                <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '32px' }}>Cleaning and bucketizing your data on the fly.</p>
                
                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>CASE WHEN (If/Else)</h3>
                <p>Create dynamic categories. Perfect for user segmentation (e.g. "Whale" vs "Minnow").</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  {"SELECT amount, CASE WHEN amount > 500 THEN 'Premium' ELSE 'Standard' END as tier FROM payments;"}
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>COALESCE</h3>
                <p>Handles NULLs. If a value is missing, it provides a fallback (like 0).</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  {"SELECT COALESCE(discount, 0) FROM orders;"}
                </code>
              </div>
            )}

            {activeSection === 'advanced' && (
              <div className="prose">
                <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>6. Power Tools</h1>
                <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '32px' }}>Writing complex queries that stay readable.</p>
                
                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Subqueries</h3>
                <p>A "query inside a query". Use it when you need to use the result of one query to filter another.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  {"SELECT name FROM users WHERE id IN (SELECT user_id FROM payments WHERE amount > 100);"}
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>CTEs (WITH clause)</h3>
                <p>The cleaner way to write subqueries. Think of it like creating a temporary "Named Range" in Excel that you can use later in the same query.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  {"WITH high_value_users AS (SELECT user_id FROM payments WHERE amount > 100) \nSELECT * FROM users JOIN high_value_users ON users.id = high_value_users.user_id;"}
                </code>
              </div>
            )}

            {activeSection === 'window' && (
              <div className="prose">
                <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>7. Analysis Pro</h1>
                <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '32px' }}>The PM superpower for growth analysis.</p>
                
                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Window Functions (OVER)</h3>
                <p>Perform math across multiple rows while still seeing every row. Perfect for running totals or ranks.</p>
                
                <h4 style={{ color: '#cbd5e1', marginTop: '20px' }}>ROW_NUMBER() / RANK()</h4>
                <p>Assigns a number to each row in a bucket. Great for finding "First Order Date" or "Last Action".</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  {"SELECT user_id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) FROM sessions;"}
                </code>

                <h4 style={{ color: '#cbd5e1', marginTop: '20px' }}>Running Totals</h4>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  {"SELECT date, SUM(amount) OVER (ORDER BY date) as cum_revenue FROM daily_sales;"}
                </code>
              </div>
            )}

            {activeSection === 'funnels' && (
              <div className="prose">
                <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>PM Funnels & Cohorts</h1>
                <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '32px' }}>Advanced techniques for measuring growth and retention.</p>
                
                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Conversion: Who paid?</h3>
                <p>Use a <code>LEFT JOIN</code> to find users who signed up but NEVER paid. These are your drop-off opportunities.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  {"SELECT u.id FROM users u LEFT JOIN payments p ON u.id = p.user_id WHERE p.id IS NULL;"}
                </code>

                <h3 style={{ fontSize: '20px', color: '#38bdf8', marginTop: '32px' }}>Active User Cohorts</h3>
                <p>Finding users who performed an action in the last 30 days.</p>
                <code style={{ display: 'block', padding: '16px', background: '#000', borderRadius: '8px', color: '#9cdcfe', marginTop: '12px' }}>
                  {"SELECT count(*) FROM sessions WHERE created_at > NOW() - INTERVAL '30 days';"}
                </code>

                <div style={{ marginTop: '40px', padding: '24px', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', borderRadius: '8px' }}>
                  <h4 style={{ color: '#38bdf8', margin: '0 0 12px 0' }}>💡 PM Secret Tip</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
                    Always check for <strong>NULL</strong> values before doing math. If a column has empty spaces, your <code>AVG()</code> or <code>SUM()</code> might give you confusing results. Use <code>COALESCE(amount, 0)</code> to treat empty spaces as zero.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

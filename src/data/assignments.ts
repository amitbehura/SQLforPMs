export interface AssignmentLevel {
  level: number;
  title: string;
  goal: string;
  teaching: {
    title: string;
    description: string;
    query: string;
  };
  tests: {
    id: string;
    prompt: string;
    solutionQuery: string;
  }[];
}

const coreAssignments: AssignmentLevel[] = [
  {
    level: 1,
    title: "Database Discovery",
    goal: "Understand what tables exist and how to peek at all their data.",
    teaching: {
      title: "The SELECT * Statement",
      description: "Welcome to PayPaySQL! Your very first job is to see what data is actually stored in our tables. We use SELECT * (Select All) to grab every single column and row. But be careful! Tables can be massive, so we always add LIMIT to restrict how many rows come back.",
      query: "SELECT * FROM merchants LIMIT 10;"
    },
    tests: [
      { id: "1-1", prompt: "Let's peek at the users. Fetch the first 5 rows from the merchant_users table.", solutionQuery: "SELECT * FROM merchant_users LIMIT 5;" },
      { id: "1-2", prompt: "What does a payment look like? Fetch the first 3 rows from the payments table.", solutionQuery: "SELECT * FROM payments LIMIT 3;" },
      { id: "1-3", prompt: "Check out the pricing plans. Fetch all rows from the pricing_plans table (there are very few, so no limit needed).", solutionQuery: "SELECT * FROM pricing_plans;" }
    ]
  },
  {
    level: 2,
    title: "Reducing Noise (Specific Columns)",
    goal: "Tables have too many columns. Learn to ask only for what you need.",
    teaching: {
      title: "Selecting Specific Columns",
      description: "Using SELECT * is great for exploring, but terrible for actual reports. It brings back too much messy data. Instead of *, you can write the exact names of the columns you want, separated by commas.",
      query: "SELECT name, country FROM merchants LIMIT 10;"
    },
    tests: [
      { id: "2-1", prompt: "We need a list of emails. Select only the email and role columns from merchant_users.", solutionQuery: "SELECT email, role FROM merchant_users;" },
      { id: "2-2", prompt: "Finance needs to review payment amounts. Select the amount and status from the payments table.", solutionQuery: "SELECT amount, status FROM payments;" },
      { id: "2-3", prompt: "Check the names of our campaigns. Select the name and budget from the campaigns table.", solutionQuery: "SELECT name, budget FROM campaigns;" }
    ]
  },
  {
    level: 3,
    title: "Basic Filtering (Exact Match)",
    goal: "Learn how to filter a massive table down to exactly the data you want.",
    teaching: {
      title: "The WHERE Clause (=)",
      description: "Now we need to filter rows. We use the WHERE clause to specify a condition. The most basic condition is the equals sign (=). Note: In SQL, text (strings) must always be wrapped in single quotes, like 'US' or 'active'.",
      query: "SELECT name FROM merchants WHERE country = 'US';"
    },
    tests: [
      { id: "3-1", prompt: "Risk team asked for suspended accounts. Find all merchants where status is 'suspended'.", solutionQuery: "SELECT * FROM merchants WHERE status = 'suspended';" },
      { id: "3-2", prompt: "Find all payments that were a 'success'.", solutionQuery: "SELECT * FROM payments WHERE status = 'success';" },
      { id: "3-3", prompt: "Look for a specific ticket. Find all support_tickets where the category is 'Delayed Settlement'.", solutionQuery: "SELECT * FROM support_tickets WHERE category = 'Delayed Settlement';" }
    ]
  },
  {
    level: 4,
    title: "Exclusion Filtering (Not Equal)",
    goal: "Learn how to exclude specific data from your results.",
    teaching: {
      title: "The Not-Equal Operator (!=)",
      description: "Sometimes it's easier to say what you DON'T want. We use != (or <>) to exclude specific rows. For example, if you want all merchants except those in the US.",
      query: "SELECT name, country FROM merchants WHERE country != 'US';"
    },
    tests: [
      { id: "4-1", prompt: "We want to see all failing payments. Select all payments where the status is NOT 'success'.", solutionQuery: "SELECT * FROM payments WHERE status != 'success';" },
      { id: "4-2", prompt: "Find all merchant_users whose role is NOT 'admin'.", solutionQuery: "SELECT * FROM merchant_users WHERE role != 'admin';" },
      { id: "4-3", prompt: "Find all support_tickets where the status is NOT 'closed'.", solutionQuery: "SELECT * FROM support_tickets WHERE status != 'closed';" }
    ]
  },
  {
    level: 5,
    title: "List Filtering (IN Operator)",
    goal: "Learn how to filter for multiple specific values at once.",
    teaching: {
      title: "The IN Clause",
      description: "What if you want to find merchants in the US, UK, and CA? You could write a lot of equals signs, but it's much cleaner to use the IN operator. It lets you check if a value exists inside a list.",
      query: "SELECT name, country FROM merchants WHERE country IN ('US', 'UK', 'CA');"
    },
    tests: [
      { id: "5-1", prompt: "Find all payments where the status is either 'failed' or 'pending'.", solutionQuery: "SELECT * FROM payments WHERE status IN ('failed', 'pending');" },
      { id: "5-2", prompt: "We want to look at Enterprise and Pro plans. Select all merchants where pricing_plan_id is IN (2, 3).", solutionQuery: "SELECT * FROM merchants WHERE pricing_plan_id IN (2, 3);" },
      { id: "5-3", prompt: "Find all invoices where the status is IN ('unpaid', 'overdue').", solutionQuery: "SELECT * FROM invoices WHERE status IN ('unpaid', 'overdue');" }
    ]
  },
  {
    level: 6,
    title: "Combining Logic (AND / OR)",
    goal: "Combine multiple filters to find extremely specific cohorts of users.",
    teaching: {
      title: "The AND & OR Operators",
      description: "You often need to apply multiple filters at the same time. Use AND when ALL conditions must be true. Use OR when ANY condition can be true. (Pro tip: use parentheses when mixing them!).",
      query: "SELECT name FROM merchants WHERE country = 'US' AND status = 'active';"
    },
    tests: [
      { id: "6-1", prompt: "Find merchants who are in 'US' AND are on the Enterprise plan (pricing_plan_id = 3).", solutionQuery: "SELECT * FROM merchants WHERE country = 'US' AND pricing_plan_id = 3;" },
      { id: "6-2", prompt: "Find support_tickets that are 'open' AND the category is 'Fraud Alert'.", solutionQuery: "SELECT * FROM support_tickets WHERE status = 'open' AND category = 'Fraud Alert';" },
      { id: "6-3", prompt: "Find all sales_leads that are assigned to sales_rep_id = 1 AND have a lead_score > 80.", solutionQuery: "SELECT * FROM sales_leads WHERE sales_rep_id = 1 AND lead_score > 80;" }
    ]
  },
  {
    level: 7,
    title: "Text Search & Cleaning (LIKE, ILIKE)",
    goal: "Deal with messy user data and search for specific text patterns.",
    teaching: {
      title: "The ILIKE Operator",
      description: "Users typo their company names often. If you want to find merchants with 'Tech' anywhere in their name, use ILIKE '%Tech%'. The percent sign (%) is a wildcard that matches any number of characters.",
      query: "SELECT name FROM merchants WHERE name ILIKE '%Corp%';"
    },
    tests: [
      { id: "7-1", prompt: "Find all support_tickets where the category contains the word 'Settlement' (case-insensitive).", solutionQuery: "SELECT * FROM support_tickets WHERE category ILIKE '%settlement%';" },
      { id: "7-2", prompt: "List all merchant_users whose email address ends in '@merchant1.com'.", solutionQuery: "SELECT * FROM merchant_users WHERE email ILIKE '%@merchant1.com';" },
      { id: "7-3", prompt: "Find all bank_accounts where the routing_number starts with 'ROUTING'.", solutionQuery: "SELECT * FROM bank_accounts WHERE routing_number ILIKE 'ROUTING%';" }
    ]
  },
  {
    level: 8,
    title: "Top-Level Metrics (Aggregations)",
    goal: "Calculate your own daily metrics without waiting for a dashboard.",
    teaching: {
      title: "SUM, AVG, and GROUP BY",
      description: "Dashboards break. You need to know how to calculate total volume yourself. Use SUM() to add things up, and GROUP BY to split that sum into categories. The Golden Rule: If you SELECT a normal column (like country) alongside an aggregation (like COUNT), you MUST put that normal column in the GROUP BY clause. You can also rename messy output columns using 'AS new_name'.",
      query: "SELECT country, COUNT(*) AS merchant_count FROM merchants GROUP BY country;"
    },
    tests: [
      { id: "8-1", prompt: "Count how many merchants we have in each country. (Alias the count as merchant_count)", solutionQuery: "SELECT country, COUNT(*) AS merchant_count FROM merchants GROUP BY country;" },
      { id: "8-2", prompt: "Calculate the total amount processed by each bank_partner_id from the payments table. (Alias the sum as total_amount)", solutionQuery: "SELECT bank_partner_id, SUM(amount) AS total_amount FROM payments GROUP BY bank_partner_id;" },
      { id: "8-3", prompt: "Find the average payment amount for each status in the payments table. (Alias the average as avg_amount)", solutionQuery: "SELECT status, AVG(amount) AS avg_amount FROM payments GROUP BY status;" }
    ]
  },
  {
    level: 9,
    title: "Date Management",
    goal: "Master time-series data and cohort grouping.",
    teaching: {
      title: "Working with Dates",
      description: "You often need to look at data for 'the last 30 days'. You can use `NOW() - INTERVAL '30 days'` to filter for recent data. To group data by month, use DATE_TRUNC('month', created_at).",
      query: "SELECT DATE_TRUNC('month', created_at), COUNT(*) FROM merchants GROUP BY DATE_TRUNC('month', created_at);"
    },
    tests: [
      { id: "9-1", prompt: "Find all payments that were created in the last 7 days. (Use NOW() - INTERVAL '7 days')", solutionQuery: "SELECT * FROM payments WHERE created_at >= NOW() - INTERVAL '7 days';" },
      { id: "9-2", prompt: "Find the count of payments grouped by their status, but only for the last 30 days.", solutionQuery: "SELECT status, COUNT(*) FROM payments WHERE created_at >= NOW() - INTERVAL '30 days' GROUP BY status;" },
      { id: "9-3", prompt: "Find all support_tickets created in the last 24 hours.", solutionQuery: "SELECT * FROM support_tickets WHERE created_at >= NOW() - INTERVAL '24 hours';" }
    ]
  },
  {
    level: 10,
    title: "Connecting Data (INNER JOIN)",
    goal: "Connect the dots between different tables.",
    teaching: {
      title: "The INNER JOIN",
      description: "A PM must bridge the gap between engineering and finance. Tables are linked by IDs. Let's link our payments to their bank partners using a JOIN. We use 'TableName.ColumnName' to specify exactly which table a column comes from.",
      query: "SELECT payments.amount, bank_partners.name FROM payments JOIN bank_partners ON payments.bank_partner_id = bank_partners.id;"
    },
    tests: [
      { id: "10-1", prompt: "List all payments alongside the name of their bank_partner.", solutionQuery: "SELECT payments.*, bank_partners.name FROM payments JOIN bank_partners ON payments.bank_partner_id = bank_partners.id;" },
      { id: "10-2", prompt: "Find the names of merchants and the names of the pricing_plans they are on.", solutionQuery: "SELECT merchants.name, pricing_plans.name FROM merchants JOIN pricing_plans ON merchants.pricing_plan_id = pricing_plans.id;" },
      { id: "10-3", prompt: "Join support_tickets to merchants to get the merchant name alongside the ticket category.", solutionQuery: "SELECT merchants.name, support_tickets.category FROM support_tickets JOIN merchants ON support_tickets.merchant_id = merchants.id;" }
    ]
  },
  {
    level: 11,
    title: "Finding Drop-offs (LEFT JOIN)",
    goal: "Analyze funnel leakage. Find users who started an action but didn't finish.",
    teaching: {
      title: "The LEFT JOIN",
      description: "INNER JOIN only keeps rows that exist in both tables. If you want to find merchants who have NEVER made a payment, you need a LEFT JOIN, and then filter where the payment ID IS NULL.",
      query: "SELECT m.name FROM merchants m LEFT JOIN payments p ON m.id = p.merchant_id WHERE p.id IS NULL;"
    },
    tests: [
      { id: "11-1", prompt: "Find all merchants (left side) and their payments, even if they have no payments.", solutionQuery: "SELECT merchants.*, payments.id as payment_id FROM merchants LEFT JOIN payments ON merchants.id = payments.merchant_id;" },
      { id: "11-2", prompt: "Find all merchants who do NOT have any merchant_users associated with them.", solutionQuery: "SELECT merchants.* FROM merchants LEFT JOIN merchant_users ON merchants.id = merchant_users.merchant_id WHERE merchant_users.id IS NULL;" },
      { id: "11-3", prompt: "Find payments that do NOT have any associated refunds.", solutionQuery: "SELECT payments.* FROM payments LEFT JOIN refunds ON payments.id = refunds.payment_id WHERE refunds.id IS NULL;" }
    ]
  },
  {
    level: 12,
    title: "Internal Comparisons (Self Joins)",
    goal: "Compare rows within the same table to find relationships or fraud rings.",
    teaching: {
      title: "The Self Join",
      description: "Sometimes we need to compare a table against itself. Because we can't JOIN 'sales_reps' to 'sales_reps' with the exact same name, we use 'Aliases' (nicknames) like t1 and t2 by writing them right after the table name.",
      query: "SELECT t1.name, t2.name FROM sales_reps t1 JOIN sales_reps t2 ON t1.region = t2.region AND t1.id != t2.id;"
    },
    tests: [
      { id: "12-1", prompt: "Find pairs of sales reps who operate in the exact same region (ensure t1.id < t2.id to avoid duplicates).", solutionQuery: "SELECT t1.name, t2.name FROM sales_reps t1 JOIN sales_reps t2 ON t1.region = t2.region AND t1.id < t2.id;" },
      { id: "12-2", prompt: "Identify pairs of merchant_users within the same merchant account who share the same role.", solutionQuery: "SELECT u1.email, u2.email FROM merchant_users u1 JOIN merchant_users u2 ON u1.merchant_id = u2.merchant_id AND u1.role = u2.role AND u1.id < u2.id;" },
      { id: "12-3", prompt: "Find two payments made by the same merchant_id with the exact same amount.", solutionQuery: "SELECT p1.id, p2.id FROM payments p1 JOIN payments p2 ON p1.merchant_id = p2.merchant_id AND p1.amount = p2.amount AND p1.id < p2.id;" }
    ]
  },
  {
    level: 13,
    title: "Business Logic & Bucketing (CASE WHEN)",
    goal: "Categorize users dynamically without altering the database.",
    teaching: {
      title: "The CASE WHEN Statement",
      description: "You can write IF/ELSE logic directly in your query! Always end the statement with 'END'. Since the output column will have a messy name, use 'AS new_name' to alias it (e.g. AS bucket).",
      query: "SELECT amount, CASE WHEN amount > 1000 THEN 'Large' ELSE 'Small' END AS bucket FROM payments;"
    },
    tests: [
      { id: "13-1", prompt: "Select all payment amounts and bucket them: 'High' if > 1000, 'Low' otherwise. (Alias the column as 'bucket')", solutionQuery: "SELECT amount, CASE WHEN amount > 1000 THEN 'High' ELSE 'Low' END AS bucket FROM payments;" },
      { id: "13-2", prompt: "Select merchants and label them 'VIP' if pricing_plan_id is 3, else 'Standard'. (Alias as 'status')", solutionQuery: "SELECT name, CASE WHEN pricing_plan_id = 3 THEN 'VIP' ELSE 'Standard' END AS status FROM merchants;" },
      { id: "13-3", prompt: "Select support_tickets and label them 'Urgent' if category is 'Delayed Settlement', else 'Normal'. (Alias as 'priority')", solutionQuery: "SELECT category, CASE WHEN category = 'Delayed Settlement' THEN 'Urgent' ELSE 'Normal' END AS priority FROM support_tickets;" }
    ]
  },
  {
    level: 14,
    title: "Nested Logic (Subqueries)",
    goal: "Filter data based on the results of another complex aggregation.",
    teaching: {
      title: "The Subquery",
      description: "Sometimes you need a query *inside* a query. If the inner query returns exactly ONE value (like an average), use > or =. If the inner query returns MULTIPLE values, use the IN operator.",
      query: "SELECT amount FROM payments WHERE amount > (SELECT AVG(amount) FROM payments);"
    },
    tests: [
      { id: "14-1", prompt: "Find all payments that are larger than the average payment amount.", solutionQuery: "SELECT * FROM payments WHERE amount > (SELECT AVG(amount) FROM payments);" },
      { id: "14-2", prompt: "Find the merchant who has the absolute highest number of payments.", solutionQuery: "SELECT merchant_id, COUNT(*) FROM payments GROUP BY merchant_id ORDER BY COUNT(*) DESC LIMIT 1;" },
      { id: "14-3", prompt: "Find merchants whose pricing plan has a monthly_fee > 0.", solutionQuery: "SELECT * FROM merchants WHERE pricing_plan_id IN (SELECT id FROM pricing_plans WHERE monthly_fee > 0);" }
    ]
  },
  {
    level: 15,
    title: "Step-By-Step Logic (CTEs)",
    goal: "Break down massive, terrifying queries into readable logic.",
    teaching: {
      title: "The WITH Clause (CTE)",
      description: "Subqueries get messy fast. Let's use a Common Table Expression (WITH) to define a temporary table first, then query from it.",
      query: "WITH VIPs AS (SELECT * FROM merchants WHERE pricing_plan_id = 3) SELECT COUNT(*) FROM VIPs;"
    },
    tests: [
      { id: "15-1", prompt: "Create a CTE named 'Failed' for failed payments, then select everything from it.", solutionQuery: "WITH Failed AS (SELECT * FROM payments WHERE status = 'failed') SELECT * FROM Failed;" },
      { id: "15-2", prompt: "Create a CTE named 'US_Merchants', then count how many there are.", solutionQuery: "WITH US_Merchants AS (SELECT * FROM merchants WHERE country = 'US') SELECT COUNT(*) FROM US_Merchants;" },
      { id: "15-3", prompt: "Create a CTE of total revenue per merchant, then find the average revenue across the platform.", solutionQuery: "WITH Revenue AS (SELECT merchant_id, SUM(amount) as total FROM payments GROUP BY merchant_id) SELECT AVG(total) FROM Revenue;" }
    ]
  },
  {
    level: 16,
    title: "Financial Reporting (Window Functions 1)",
    goal: "Calculate running totals and rolling averages.",
    teaching: {
      title: "OVER() and PARTITION BY",
      description: "Window functions let you calculate aggregates (like SUM) alongside normal row data without collapsing the rows using GROUP BY. Don't forget to alias the result using 'AS'!",
      query: "SELECT amount, SUM(amount) OVER (PARTITION BY merchant_id) AS merchant_total FROM payments;"
    },
    tests: [
      { id: "16-1", prompt: "Select payment amounts and the SUM of all payments for that specific merchant. (Alias as merchant_total)", solutionQuery: "SELECT amount, SUM(amount) OVER (PARTITION BY merchant_id) AS merchant_total FROM payments;" },
      { id: "16-2", prompt: "Select invoice totals and the AVG invoice total per merchant. (Alias as merchant_avg)", solutionQuery: "SELECT total_fees, AVG(total_fees) OVER (PARTITION BY merchant_id) AS merchant_avg FROM invoices;" },
      { id: "16-3", prompt: "Calculate a running cumulative sum of payment amounts ordered by created_at. (Alias as running_total)", solutionQuery: "SELECT amount, created_at, SUM(amount) OVER (ORDER BY created_at) AS running_total FROM payments;" }
    ]
  },
  {
    level: 17,
    title: "Leaderboards (Window Functions 2)",
    goal: "Build leaderboards and find the Top N items per category.",
    teaching: {
      title: "RANK() and ROW_NUMBER()",
      description: "Want the top 3 merchants per country? RANK() OVER() assigns a rank to each row within its partition.",
      query: "SELECT name, RANK() OVER (PARTITION BY country ORDER BY created_at DESC) FROM merchants;"
    },
    tests: [
      { id: "17-1", prompt: "Rank the payments by amount in descending order. (Alias as rank)", solutionQuery: "SELECT amount, RANK() OVER (ORDER BY amount DESC) AS rank FROM payments;" },
      { id: "17-2", prompt: "Rank merchants within each country by when they were created (oldest first). (Alias as rank)", solutionQuery: "SELECT name, country, RANK() OVER (PARTITION BY country ORDER BY created_at ASC) AS rank FROM merchants;" },
      { id: "17-3", prompt: "Assign a unique ROW_NUMBER to each payment for a merchant ordered by amount. (Alias as row_num)", solutionQuery: "SELECT merchant_id, amount, ROW_NUMBER() OVER (PARTITION BY merchant_id ORDER BY amount DESC) AS row_num FROM payments;" }
    ]
  },
  {
    level: 18,
    title: "MoM Growth (Window Functions 3)",
    goal: "Calculate Month-over-Month growth and time-to-conversion.",
    teaching: {
      title: "LAG() and LEAD()",
      description: "Did our revenue grow from last month? LAG() lets you grab data from the *previous* row to compare it to the current row.",
      query: "SELECT month, total_fees, LAG(total_fees) OVER (ORDER BY month) as prev_month_fees FROM invoices;"
    },
    tests: [
      { id: "18-1", prompt: "Select each invoice total and use LAG() to get the previous invoice total ordered by month. (Alias as prev_total)", solutionQuery: "SELECT total_fees, LAG(total_fees) OVER (ORDER BY month) AS prev_total FROM invoices;" },
      { id: "18-2", prompt: "Select each payment amount and use LEAD() to get the NEXT payment amount ordered by created_at. (Alias as next_amount)", solutionQuery: "SELECT amount, LEAD(amount) OVER (ORDER BY created_at) AS next_amount FROM payments;" },
      { id: "18-3", prompt: "Calculate the difference between the current invoice total and the previous invoice total (using LAG). (Alias as diff)", solutionQuery: "SELECT total_fees - LAG(total_fees) OVER (ORDER BY month) AS diff FROM invoices;" }
    ]
  }
];

export const assignments = coreAssignments;
export const pmCurriculum = coreAssignments;

export const stakeholderCurriculum = coreAssignments.slice(0, 5).map((a, i) => ({ ...a, level: i + 1 }));

export const analystCurriculum = coreAssignments.slice(7).map((a, i) => ({ ...a, level: i + 1 }));

export function getCurriculum(role: string | null): AssignmentLevel[] {
  if (role === 'Analyst') return analystCurriculum;
  if (role === 'Stakeholder') return stakeholderCurriculum;
  return pmCurriculum;
}

import React, { useState, useEffect } from 'react';
import { getDb } from '../lib/db';
import { Database, Table, Columns, Key, Folder } from 'lucide-react';

interface ColumnInfo {
  name: string;
  type: string;
}

interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  department: string;
}

const DEPARTMENT_MAPPING: Record<string, string[]> = {
  '📁 Core / Users': ['merchants', 'merchant_users', 'pricing_plans', 'features', 'merchant_features', 'subscriptions'],
  '📁 Sales & CRM': ['sales_reps', 'sales_leads', 'contracts', 'campaigns', 'promotions', 'coupon_codes'],
  '📁 Finance': ['bank_partners', 'payments', 'refunds', 'settlements', 'taxes', 'invoices', 'bank_accounts'],
  '📁 Ops & Risk': ['support_tickets', 'risk_flags', 'chargebacks', 'kyc_documents', 'fraud_rules', 'disputes'],
  '📁 Tech': ['deployments', 'api_requests_log', 'webhooks', 'api_keys', 'server_logs', 'feature_flags']
};

function getDepartment(tableName: string) {
  for (const [dept, tables] of Object.entries(DEPARTMENT_MAPPING)) {
    if (tables.includes(tableName)) return dept;
  }
  return '📁 Other';
}

export function DatabaseNavigator() {
  const [tablesByDept, setTablesByDept] = useState<Record<string, TableInfo[]>>({});
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['📁 Core / Users']));

  useEffect(() => {
    async function loadSchema() {
      try {
        const db = await getDb();
        const tablesRes = await db.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          ORDER BY table_name;
        `);
        
        const tableNames = tablesRes.rows.map((r: any) => r.table_name);
        
        const schemaData: TableInfo[] = [];
        for (const tName of tableNames) {
          const colsRes = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = $1
            ORDER BY ordinal_position;
          `, [tName]);
          
          schemaData.push({
            name: tName,
            columns: colsRes.rows.map((r: any) => ({ name: r.column_name, type: r.data_type })),
            department: getDepartment(tName)
          });
        }

        const grouped = schemaData.reduce((acc, curr) => {
          if (!acc[curr.department]) acc[curr.department] = [];
          acc[curr.department].push(curr);
          return acc;
        }, {} as Record<string, TableInfo[]>);

        setTablesByDept(grouped);
      } catch (err) {
        console.error("Failed to load schema", err);
      }
    }
    
    loadSchema();
  }, []);

  const toggleNode = (nodeName: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeName)) newExpanded.delete(nodeName);
    else newExpanded.add(nodeName);
    setExpandedNodes(newExpanded);
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
      <div className="tree-node" style={{ paddingLeft: '8px' }}>
        <div className="tree-item" style={{ fontWeight: 'bold' }}>
          <Database size={14} className="tree-icon" /> public
        </div>
        
        <div className="tree-node" style={{ paddingLeft: '12px' }}>
          {Object.entries(tablesByDept).map(([dept, tables]) => (
            <div key={dept}>
              <div className="tree-item" onClick={() => toggleNode(dept)} style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                {expandedNodes.has(dept) ? '▾' : '▸'} <Folder size={14} style={{ color: '#dcb67a' }} /> {dept.replace('📁 ', '')}
              </div>

              {expandedNodes.has(dept) && (
                <div className="tree-node" style={{ paddingLeft: '16px' }}>
                  {tables.map(t => (
                    <div key={t.name}>
                      <div className="tree-item" onClick={() => toggleNode(t.name)}>
                        {expandedNodes.has(t.name) ? '▾' : '▸'} <Table size={14} className="tree-icon" style={{ color: '#dcdcaa' }} /> {t.name}
                      </div>
                      
                      {expandedNodes.has(t.name) && (
                        <div className="tree-node" style={{ paddingLeft: '16px' }}>
                          <div className="tree-item" style={{ color: 'var(--text-muted)' }}>
                            <Columns size={12} /> Columns
                          </div>
                          <div className="tree-node" style={{ paddingLeft: '12px' }}>
                            {t.columns.map(c => (
                              <div key={c.name} className="tree-item" style={{ fontSize: '12px' }}>
                                {c.name === 'id' || c.name.endsWith('_id') ? <Key size={12} style={{ color: '#cca700' }} /> : <div style={{width: '12px'}} />}
                                <span style={{ color: '#9cdcfe' }}>{c.name}</span>
                                <span style={{ color: 'var(--text-muted)', marginLeft: '4px', fontSize: '11px' }}>{c.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

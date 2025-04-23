// pages/api/query.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { host, port, user, password, database, query } = req.body;

  try {
    // Send query to n8n AI agent webhook
    const n8nRes = await fetch('https://your-n8n-domain/webhook/sql-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const n8nData = await n8nRes.json();
    const sql = n8nData.sql;

    if (!sql) {
      return res.status(400).json({ error: 'No SQL returned by LLM' });
    }

    // Connect to MySQL
    const connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
      database,
    });

    const [rows] = await connection.execute(sql);
    await connection.end();

    res.status(200).json({ rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
}

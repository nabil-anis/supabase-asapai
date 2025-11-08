import { createClient } from '@supabase/supabase-js';

// Connect using environment variables (keys stay hidden)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Name of the table
const TABLE_NAME = 'project_reports';

export default async function handler(req, res) {
  try {
    // Check if table exists
    const { data: tableExists, error: checkError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('tablename', TABLE_NAME);

    if (checkError) throw checkError;

    // If table doesn't exist, create it
    if (!tableExists || tableExists.length === 0) {
      const createTableSQL = `
        create table if not exists ${TABLE_NAME} (
          id uuid primary key default gen_random_uuid(),
          title text,
          context text,
          url text,
          source_code text,
          analysis_report json,
          viva_questions json,
          created_at timestamp default now()
        );
      `;
      const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
      if (createError) throw createError;
    }

    if (req.method === 'POST') {
      // Save a new report
      const report = req.body;
      const { data, error } = await supabase.from(TABLE_NAME).insert([report]);
      if (error) throw error;
      return res.status(200).json({ status: 'success', data });
    }

    if (req.method === 'GET') {
      // Fetch all reports
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ status: 'success', data });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
}

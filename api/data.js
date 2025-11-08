import { createClient } from '@supabase/supabase-js';

// Connect using environment variables (keys stay hidden)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Table name
const TABLE_NAME = 'project_reports';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // Save a new project report
      const report = req.body;

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([report]);

      if (error) throw error;
      return res.status(200).json({ status: 'success', data });
    }

    if (req.method === 'GET') {
      // Fetch all project reports
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ status: 'success', data });
    }

    // Other methods not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
}

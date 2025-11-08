import { createClient } from '@supabase/supabase-js';

// Use the environment variables you set in Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // Save a new project report
      const report = req.body;

      // Insert into Supabase table named 'project_reports'
      const { data, error } = await supabase
        .from('project_reports')
        .insert([report]);

      if (error) throw error;
      return res.status(200).json({ status: 'success', data });
    } 
    
    if (req.method === 'GET') {
      // Fetch all project reports
      const { data, error } = await supabase
        .from('project_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ status: 'success', data });
    }

    // Other methods not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}


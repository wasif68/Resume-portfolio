import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://axvwhxjsxarecgdghgnc.supabase.co";
const supabaseKey = "sb_publishable_sbWIKGUA4x3LA0Da696jBA_aQAcXTVl";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Checking resume_profile table...");
  const { data, error } = await supabase.from("resume_profile").select("*").limit(1);
  if (error) {
    console.error("Error fetching resume_profile:", error);
  } else {
    console.log("Success! Data fetched:", data);
  }

  console.log("Checking todo_tasks table...");
  const { data: todoData, error: todoError } = await supabase.from("todo_tasks").select("*").limit(1);
  if (todoError) {
    console.warn("todo_tasks query failed:", todoError.message);
  } else {
    console.log("Success! todo_tasks fetched:", todoData);
  }

  console.log("Checking journal_entries table...");
  const { data: journalData, error: journalError } = await supabase.from("journal_entries").select("*").limit(1);
  if (journalError) {
    console.warn("journal_entries query failed:", journalError.message);
  } else {
    console.log("Success! journal_entries fetched:", journalData);
  }
}

run();

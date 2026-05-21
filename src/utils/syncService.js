import { supabase } from "./supabase";

const RESUME_KEY = "resume_data_v1";
const RESUME_ID = "my-resume";

/**
 * RESUME PROFILE (Single-row model)
 */

export async function fetchResumeData(defaultData) {
  try {
    const { data, error } = await supabase
      .from("resume_profile")
      .select("data")
      .eq("id", RESUME_ID)
      .maybeSingle();

    if (error) throw error;
    
    if (data && data.data) {
      localStorage.setItem(RESUME_KEY, JSON.stringify(data.data));
      return { data: data.data, source: "supabase" };
    }
  } catch (e) {
    console.warn("Supabase fetch failed, falling back to local cache:", e.message);
  }

  // Fallback to local storage
  const local = localStorage.getItem(RESUME_KEY);
  if (local) {
    try {
      return { data: JSON.parse(local), source: "local" };
    } catch (_) {}
  }
  return { data: defaultData, source: "local" };
}

export async function saveResumeData(data) {
  // Always update local cache immediately
  localStorage.setItem(RESUME_KEY, JSON.stringify(data));

  try {
    const { error } = await supabase
      .from("resume_profile")
      .upsert({ 
        id: RESUME_ID, 
        data: data, 
        updated_at: new Date().toISOString() 
      }, { onConflict: 'id' });
    
    if (error) throw error;
    return { success: true };
  } catch (e) {
    console.error("Supabase save failed:", e.message);
    return { success: false, error: e.message };
  }
}

/**
 * TODO & JOURNAL (Legacy support or simple sync)
 * Note: These are currently multi-row but can be kept as-is or simplified if needed.
 * For now, we focus on the Resume Profile requirement.
 */

const TODO_KEY = "todo_tasks";
const JOURNAL_KEY = "journal_entries";

export async function fetchTodos(defaultData) {
  try {
    const { data, error } = await supabase.from("todo_tasks").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    if (data) {
      localStorage.setItem(TODO_KEY, JSON.stringify(data));
      return { data, source: "supabase" };
    }
  } catch (e) { console.warn("Todo fetch failed:", e.message); }
  const local = localStorage.getItem(TODO_KEY);
  return { data: local ? JSON.parse(local) : defaultData, source: "local" };
}

export async function saveTodos(todos) {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
  try {
    await supabase.from("todo_tasks").delete().neq("id", "_dummy_");
    if (todos.length > 0) {
      const { error } = await supabase.from("todo_tasks").insert(todos.map(t => ({...t, created_at: new Date().toISOString()})));
      if (error) throw error;
    }
    return { success: true };
  } catch (e) { return { success: false }; }
}

export async function fetchJournalEntries(defaultData) {
  try {
    const { data, error } = await supabase.from("journal_entries").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    if (data) {
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(data));
      return { data, source: "supabase" };
    }
  } catch (e) { console.warn("Journal fetch failed:", e.message); }
  const local = localStorage.getItem(JOURNAL_KEY);
  return { data: local ? JSON.parse(local) : defaultData, source: "local" };
}

export async function saveJournalEntries(entries) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  try {
    await supabase.from("journal_entries").delete().neq("id", "_dummy_");
    if (entries.length > 0) {
      const { error } = await supabase.from("journal_entries").insert(entries);
      if (error) throw error;
    }
    return { success: true };
  } catch (e) { return { success: false }; }
}

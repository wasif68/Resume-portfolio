import { supabase } from "./supabase";
import { defaultResumeData } from "../components/resume/defaultData";

const RESUME_KEY = "resume_data_v1";
const TODO_KEY = "todo_tasks";
const JOURNAL_KEY = "journal_entries";


// ----------------- CONNECTION TEST -----------------
export async function testConnection() 
{
  try {
    const { data, error } = await supabase
      .from("resume_profile")
      .select("id")
      .limit(1);

    if (error) throw error;
    return true;
  } catch (e) {
    console.warn("Supabase connection failed:", e.message);
    return false;
  }
}


// ----------------- RESUME HELPERS -----------------

// CREATE resume if not exists (IMPORTANT FIX)
export async function ensureResumeExists(user) {
  if (!user) return;

  const { data } = await supabase
    .from("resume_profile")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) {
    await supabase.from("resume_profile").insert({
      user_id: user.id,
      data: defaultResumeData,
      updated_at: new Date().toISOString(),
    });
  }
}


// FETCH resume (FIXED: uses user_id, not "default")
export async function fetchResumeData(user, defaultData) {
  if (!user) return { data: defaultData, source: "local" };

  try {
    const { data, error } = await supabase
      .from("resume_profile")
      .select("data")
      .eq("user_id", user.id)
      .single();

    if (error) throw error;

    if (data?.data) {
      localStorage.setItem(RESUME_KEY, JSON.stringify(data.data));
      return { data: data.data, source: "supabase" };
    }
  } catch (e) {
    console.warn("Falling back to localStorage:", e.message);
  }

  const local = localStorage.getItem(RESUME_KEY);
  if (local) {
    try {
      return { data: JSON.parse(local), source: "local" };
    } catch (_) {}
  }

  return { data: defaultData, source: "local" };
}


// SAVE resume (FIXED: user_id based + safe upsert)
export async function saveResumeData(user, data) {
  if (!user) return { success: false, source: "local" };

  localStorage.setItem(RESUME_KEY, JSON.stringify(data));

  try {
    const { error } = await supabase
      .from("resume_profile")
      .upsert({
        user_id: user.id,
        data: data,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    return { success: true, source: "supabase" };
  } catch (e) {
    console.error("Failed to save resume:", e.message);
    return { success: false, source: "local" };
  }
}


// ----------------- TODOS -----------------

export async function fetchTodos(defaultData) {
  try {
    const { data, error } = await supabase
      .from("todo_tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (data) {
      const formatted = data.map((t) => ({
        id: t.id,
        text: t.text,
        completed: t.completed,
        priority: t.priority,
        type: t.type || "task",
      }));

      localStorage.setItem(TODO_KEY, JSON.stringify(formatted));
      return { data: formatted, source: "supabase" };
    }
  } catch (e) {
    console.warn("Todos fallback localStorage:", e.message);
  }

  const local = localStorage.getItem(TODO_KEY);
  if (local) {
    try {
      return { data: JSON.parse(local), source: "local" };
    } catch (_) {}
  }

  return { data: defaultData, source: "local" };
}


export async function saveTodos(todos) {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));

  try {
    await supabase.from("todo_tasks").delete().neq("id", "_dummy_");

    if (todos.length > 0) {
      const rows = todos.map((t, idx) => ({
        id: t.id.toString(),
        text: t.text,
        completed: t.completed,
        priority: t.priority,
        type: t.type || "task",
        created_at: new Date(Date.now() - idx * 1000).toISOString(),
      }));

      const { error } = await supabase.from("todo_tasks").insert(rows);
      if (error) throw error;
    }

    return { success: true, source: "supabase" };
  } catch (e) {
    console.error("Todo sync failed:", e.message);
    return { success: false, source: "local" };
  }
}


// ----------------- DSA TASKS -----------------

export async function fetchDsaTasks(defaultData) {
  try {
    const { data, error } = await supabase
      .from("dsa_tasks")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      const formatted = data.map((t) => ({
        id: t.id,
        platform: t.platform,
        slug: t.slug,
        title: t.title,
        status: t.status,
        selectedLangs: t.selected_langs || [],
      }));

      localStorage.setItem("dsa_tasks_v1", JSON.stringify(formatted));
      return { data: formatted, source: "supabase" };
    }
  } catch (e) {
    console.warn("DSA tasks fallback localStorage:", e.message);
  }

  const local = localStorage.getItem("dsa_tasks_v1");
  if (local) {
    try {
      return { data: JSON.parse(local), source: "local" };
    } catch (_) {}
  }

  return { data: defaultData, source: "local" };
}

export async function saveDsaTasks(tasks) {
  localStorage.setItem("dsa_tasks_v1", JSON.stringify(tasks));

  try {
    // Clean slate for simplicity (similar to todos)
    await supabase.from("dsa_tasks").delete().neq("id", "_dummy_");

    if (tasks.length > 0) {
      const rows = tasks.map((t, idx) => ({
        id: t.id,
        platform: t.platform,
        slug: t.slug,
        title: t.title,
        status: t.status,
        selected_langs: t.selectedLangs || [],
        created_at: new Date(Date.now() - idx * 1000).toISOString(),
      }));

      const { error } = await supabase.from("dsa_tasks").insert(rows);
      if (error) throw error;
    }

    return { success: true, source: "supabase" };
  } catch (e) {
    console.error("DSA sync failed:", e.message);
    return { success: false, source: "local" };
  }
}

export async function fetchJournalEntries(defaultData) {
  try {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (data) {
      const formatted = data.map((e) => ({
        id: e.id,
        title: e.title,
        content: e.content,
        date: e.date,
      }));

      localStorage.setItem(JOURNAL_KEY, JSON.stringify(formatted));
      return { data: formatted, source: "supabase" };
    }
  } catch (e) {
    console.warn("Journal fallback localStorage:", e.message);
  }

  const local = localStorage.getItem(JOURNAL_KEY);
  if (local) {
    try {
      return { data: JSON.parse(local), source: "local" };
    } catch (_) {}
  }

  return { data: defaultData, source: "local" };
}


export async function saveJournalEntries(entries) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));

  try {
    await supabase.from("journal_entries").delete().neq("id", "_dummy_");

    if (entries.length > 0) {
      const rows = entries.map((e, idx) => ({
        id: e.id,
        title: e.title,
        content: e.content,
        date: e.date,
        created_at: new Date(Date.now() - idx * 1000).toISOString(),
      }));

      const { error } = await supabase.from("journal_entries").insert(rows);
      if (error) throw error;
    }

    return { success: true, source: "supabase" };
  } catch (e) {
    console.error("Journal sync failed:", e.message);
    return { success: false, source: "local" };
  }
}
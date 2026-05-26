import React, { useState, useEffect, useRef } from "react";
import ResumeHeader from "../components/resume/ResumeHeader";
import { ProfileHeader, AboutCard } from "../components/resume/AboutSection";
import ExperienceSection from "../components/resume/ExperienceSection";
import SkillsSection from "../components/resume/SkillsSection";
import ProjectsSection from "../components/resume/ProjectsSection";
import { defaultResumeData } from "../components/resume/defaultData";
import { fetchResumeData, saveResumeData } from "../utils/syncService";
import { getCurrentUser, onAuthStateChange, signOut } from "../utils/supabase";
import EducationSection from "../components/resume/EducationSectionNew";
import AuthModal from "../components/AuthModal";

const LOCAL_STORAGE_KEY = "resume_data_v1";

// Helper function to seed data if empty
const seedResumeIfEmpty = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultResumeData));
    return defaultResumeData;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultResumeData;
  }
};

export default function Home() {
  const [mode, setMode] = useState("view");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const isAdmin = !!user; // Simplified: Auth only controls edit permission
  const isEditMode = mode === "owner" && isAdmin;

  const [resumeData, setResumeData] = useState(() => seedResumeIfEmpty());
  const [syncStatus, setSyncStatus] = useState("saved"); // 'saved' | 'saving' | 'error'
  const autosaveTimerRef = useRef(null);

  // Normalize helper to ensure arrays/defaults
  const normalize = (incoming) => ({
    ...defaultResumeData,
    ...incoming,
    about: { ...defaultResumeData.about, ...(incoming.about || {}) },
    experience: incoming.experience || [],
    skills: incoming.skills || [],
    projects: incoming.projects || [],
    education: incoming.education || []
  });

  // Initial Load
  useEffect(() => {
    let active = true;

    // Fetch from Supabase, then merge
    fetchResumeData(defaultResumeData).then((res) => {
      if (active && res?.data) {
        setResumeData(normalize(res.data));
      }
    });

    // Auth listener
    getCurrentUser().then((r) => setUser(r?.user ?? null));
    const sub = onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) setMode("view");
    });

    return () => {
      active = false;
      try { sub?.unsubscribe?.(); } catch (e) {}
    };
  }, []);

  // Autosave Hook (Debounced)
  useEffect(() => {
    // 1. Update localStorage instantly
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resumeData));

    // 2. Only trigger Supabase sync if we are in owner mode and logged in
    if (!isAdmin || mode !== "owner") return;

    // Clear previous timer
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

    // Set new timer
    setSyncStatus("saving");
    autosaveTimerRef.current = setTimeout(async () => {
      const res = await saveResumeData(resumeData);
      setSyncStatus(res.success ? "saved" : "error");
    }, 1500); // 1.5 second debounce

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [resumeData, isAdmin, mode]);

  const handleRequestModeChange = (targetMode) => {
    if (targetMode === "view") {
      setMode("view");
      return;
    }
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setMode("owner");
  };

  const handleAuthSuccess = async () => {
    setAuthModalOpen(false);
    const r = await getCurrentUser();
    setUser(r?.user ?? null);
    if (r?.user) setMode("owner");
  };

  // State Update Helpers (Synchronous - let useEffect handle the sync)
  const updateAbout = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      about: { ...prev.about, [field]: value }
    }));
  };

  const addExperience = (newExp) => {
    setResumeData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), newExp]
    }));
  };

  const updateExperience = (id, updatedExp) => {
    setResumeData(prev => ({
      ...prev,
      experience: (prev.experience || []).map(item => item.id === id ? updatedExp : item)
    }));
  };

  const deleteExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: (prev.experience || []).filter(item => item.id !== id)
    }));
  };

  const addSkill = (newSkill) => {
    if (!newSkill) return;
    setResumeData(prev => {
      const curSkills = Array.isArray(prev.skills) ? prev.skills : [];
      if (curSkills.includes(newSkill)) return prev;
      return { ...prev, skills: [...curSkills, newSkill] };
    });
  };

  const deleteSkill = (skill) => {
    setResumeData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter(s => s !== skill)
    }));
  };

  const addProject = (proj) => {
    setResumeData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), proj]
    }));
  };

  const updateProject = (id, updatedProj) => {
    setResumeData(prev => ({
      ...prev,
      projects: (prev.projects || []).map(p => p.id === id ? updatedProj : p)
    }));
  };

  const deleteProject = (id) => {
    setResumeData(prev => ({
      ...prev,
      projects: (prev.projects || []).filter(p => p.id !== id)
    }));
  };

  const handlePrint = () => window.print();

  return (
    <div className="resume-container">
      {/* Sync Status Floating Indicator */}
      {isAdmin && mode === "owner" && (
        <div className={`sync-status-badge ${syncStatus}`}>
          {syncStatus === "saving" && "⏳ Saving..."}
          {syncStatus === "saved" && "✅ Saved to Cloud"}
          {syncStatus === "error" && "❌ Sync Error"}
        </div>
      )}

      <ResumeHeader
        mode={mode}
        onRequestModeChange={handleRequestModeChange}
        onPrint={handlePrint}
        isAdmin={isAdmin}
        userEmail={user?.email}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onSignOut={async () => {
          await signOut();
          setUser(null);
          setMode("view");
        }}
      />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />

      <ProfileHeader
        about={resumeData.about}
        isEditMode={isEditMode}
        onUpdate={updateAbout}
      />

      {isEditMode && (
        <div className="edit-mode-notice">
          ✏️ Edit Mode Active - Changes autosave to Supabase
        </div>
      )}

      <div className="resume-body-grid">
        <div className="resume-left-col">
          <AboutCard about={resumeData.about} isEditMode={isEditMode} onUpdate={updateAbout} />
          
          <ExperienceSection
            experience={resumeData.experience}
            isEditMode={isEditMode}
            onAdd={addExperience}
            onUpdate={updateExperience}
            onDelete={deleteExperience}
          />

          <EducationSection
            education={resumeData.education}
            isEditMode={isEditMode}
            onAdd={(newEdu) => setResumeData(prev => ({ ...prev, education: [...(prev.education || []), newEdu] }))}
            onUpdate={(id, updatedEdu) => setResumeData(prev => ({
              ...prev,
              education: (prev.education || []).map(e => (e.id === id ? updatedEdu : e))
            }))}
            onDelete={(id) => setResumeData(prev => ({
              ...prev,
              education: (prev.education || []).filter(e => e.id !== id)
            }))}
          />
        </div>

        <div className="resume-right-col">
          <SkillsSection
            skills={resumeData.skills}
            isEditMode={isEditMode}
            onAddSkill={addSkill}
            onDeleteSkill={deleteSkill}
          />

          <ProjectsSection
            projects={resumeData.projects}
            isEditMode={isEditMode}
            onAdd={addProject}
            onUpdate={updateProject}
            onDelete={deleteProject}
          />
        </div>
      </div>
    </div>
  );
}

export const defaultResumeData = {
  about: {
    name: "Alexander Mercer",
    title: "Senior Full-Stack Engineer",
    location: "San Francisco, CA (Remote)",
    bio: "Passionate software engineer specializing in building high-performance, accessible, and scalable web applications. Over 6 years of experience transforming complex business requirements into clean, modular, and maintainable code."
  },

  experience: [
    {
      id: "exp-1",
      title: "Lead Software Engineer",
      company: "InnovateTech Labs",
      category: "Company",
      projectLink: "https://dashboard.innovatetech.com",
      startYear: "2023",
      endYear: "Present",
      description:
        "Architected and built a high-performance React SaaS dashboard, boosting client-side data rendering speeds by 40%.\nLead a team of 5 engineers, establishing modern CI/CD pipelines.\nPioneered migration from legacy codebase to modern React 19 and Vite.",
      tech: ["React", "Node.js", "PostgreSQL", "Vite"]
    },
    {
      id: "exp-2",
      title: "Frontend Engineer",
      company: "WebFlow Solutions",
      category: "Company",
      startYear: "2020",
      endYear: "2023",
      description:
        "Developed responsive enterprise-grade client dashboards using React, TypeScript, and Next.js.\nOptimized web applications for SEO and performance, reducing initial load times by 25%.",
      tech: ["React", "TypeScript", "Next.js", "Tailwind CSS"]
    }
  ],

  skills: [
    "React",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "Python",
    "SQL",
    "Docker",
    "Git"
  ],

  projects: [
    {
      id: "proj-1",
      title: "SaaS Analytics Dashboard",
      github: "https://github.com",
      live: "https://example.com"
    }
  ],

  // 🧠 NEW: EDUCATION / ACADEMIC SECTION
  education: [
    {
      id: "edu-1",
      degree: "BSc in Computer Science & Engineering",
      institution: "Independent University Bangladesh (IUB)",
      startYear: "2023",
      endYear: "Present",
      description:
        "Focused on software engineering, data structures, algorithms, databases, and full-stack web development. Actively building real-world projects alongside academic learning.",
      cgpa: "3.8/4.0",
      courses: [
        { name: "Data Structures & Algorithms", grade: "A" },
        { name: "Web Development", grade: "A-" },
        { name: "Database Systems", grade: "A" },
        { name: "Networking", grade: "B+" }
      ]
    },
    {
      id: "edu-2",
      degree: "Higher Secondary Certificate (HSC)",
      institution: "Your College Name",
      startYear: "2020",
      endYear: "2022",
      description:
        "Studied science group with focus on Mathematics, Physics, and ICT.",
      cgpa: "4.80/5.00",
      courses: [
        { name: "Mathematics" },
        { name: "Physics" },
        { name: "Information and Communication Technology" }
      ]
    }
    ,
    {
      id: "edu-3",
      degree: "Certificate: Full-Stack Web Development (Bootcamp)",
      institution: "Online Bootcamp Academy",
      startYear: "2022",
      endYear: "2022",
      description:
        "Intensive full-stack program covering modern web development practices, project-based learning and deployment workflows.",
      cgpa: "N/A",
      courses: [
        { name: "Web Development", grade: "A" },
        { name: "Data Structures & Algorithms", grade: "A" },
        { name: "Database Systems", grade: "A-" },
        { name: "Networking", grade: "B+" }
      ]
    }
  ]
};
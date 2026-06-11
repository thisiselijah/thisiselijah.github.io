import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface SiteData {
  title: string;
  description: string;
  author: string;
  email: string;
  github: string;
  linkedin: string;
  cv?: string;
  hero: {
    greeting: string;
    name: string;
    subtitle: string;
    description: string;
  };
  about: {
    title: string;
    content: string;
    skills: string[];
  };
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    duration: string;
    description: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
  notes: Array<{
    title: string;
    description: string;
    date: string;
    link: string;
  }>;
}

// Helper to check if a value is literally the word "NONE"
function isNone(val: any): boolean {
  if (typeof val === 'string' && val.trim().toUpperCase() === 'NONE') return true;
  return false;
}

// Helper function to load and parse the markdown config
export function getSiteData(): SiteData {
  const contentPath = path.join(process.cwd(), 'content.md');
  const fileContents = fs.readFileSync(contentPath, 'utf8');
  
  // Parse the YAML frontmatter and markdown body
  const { data, content } = matter(fileContents);
  
  const parsedContent = isNone(content) ? "" : content.trim();
  const rawAbout = isNone(data.about) ? {} : (data.about || {});
  
  return {
    ...(data as any),
    about: {
      ...rawAbout,
      content: parsedContent,
      skills: isNone(rawAbout.skills) ? [] : (rawAbout.skills || []),
    },
    experience: isNone(data.experience) ? [] : (data.experience || []),
    education: isNone(data.education) ? [] : (data.education || []),
    projects: isNone(data.projects) ? [] : (data.projects || []).map((p: any) => ({
      ...p,
      technologies: isNone(p.technologies) ? [] : (p.technologies || [])
    })),
    notes: isNone(data.notes) ? [] : (data.notes || []),
  } as SiteData;
}


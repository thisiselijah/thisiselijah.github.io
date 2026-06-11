import { getSiteData } from "@/data";
import ThreeCanvas from "@/components/ThreeCanvas";
import ScrollAnimations from "@/components/ScrollAnimations";
import ThreeIcon from "@/components/ThreeIcon";

export default function Home() {
  const SITE_DATA = getSiteData();

  const hasAboutContent = SITE_DATA.about?.content?.trim().length > 0;
  const hasAboutSkills = SITE_DATA.about?.skills && SITE_DATA.about.skills.length > 0;
  const hasAbout = hasAboutContent || hasAboutSkills;
  
  const hasEducation = SITE_DATA.education && SITE_DATA.education.length > 0;
  const hasExperience = SITE_DATA.experience && SITE_DATA.experience.length > 0;
  const hasProjects = SITE_DATA.projects && SITE_DATA.projects.length > 0;
  const hasNotes = SITE_DATA.notes && SITE_DATA.notes.length > 0;

  return (
    <>
      <ScrollAnimations />
      <ThreeCanvas />
      <div className="bg-gradient-circle bg-circle-1"></div>
      <div className="bg-gradient-circle bg-circle-2"></div>
      
      <header className="site-header hidden-mobile">
        <div className="container header-container">
          <div className="header-links">
            {SITE_DATA.github && (
              <a href={SITE_DATA.github} target="_blank" rel="noopener noreferrer" className="header-link" aria-label="GitHub" title="GitHub">
                <ThreeIcon type="github" />
                <span>GitHub</span>
              </a>
            )}
            {SITE_DATA.linkedin && (
              <a href={SITE_DATA.linkedin} target="_blank" rel="noopener noreferrer" className="header-link" aria-label="LinkedIn" title="LinkedIn">
                <ThreeIcon type="linkedin" />
                <span>LinkedIn</span>
              </a>
            )}
            {SITE_DATA.email && (
              <a href={`mailto:${SITE_DATA.email}`} className="header-link" aria-label="Email" title="Email Me">
                <ThreeIcon type="email" />
                <span>Email</span>
              </a>
            )}
            {SITE_DATA.cv && (
              <a href={SITE_DATA.cv} target="_blank" rel="noopener noreferrer" className="header-link" aria-label="CV" title="CV">
                <ThreeIcon type="cv" />
                <span>CV</span>
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="container">
        {/* Hero Section */}
        {SITE_DATA.hero && (
          <section id="home">
            <p className="text-muted">{SITE_DATA.hero.greeting}</p>
            <h1 className="hero-title">{SITE_DATA.hero.name}</h1>
            <h2 className="hero-subtitle">{SITE_DATA.hero.subtitle}</h2>
            <p className="hero-description">{SITE_DATA.hero.description}</p>
          </section>
        )}

        {/* About Section */}
        <section id="about">
          <h2 className="section-title">{SITE_DATA.about?.title || "About"}</h2>
          {hasAbout ? (
            <div className="glass-card">
              {hasAboutContent && <p>{SITE_DATA.about.content}</p>}
              {hasAboutSkills && (
                <div className="skills-container">
                  {SITE_DATA.about.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card">
              <p style={{ margin: 0 }}>NONE</p>
            </div>
          )}
        </section>

        {/* Education Section */}
        <section id="education">
          <h2 className="section-title">Education</h2>
          {hasEducation ? (
            <div className="experience-list">
              {SITE_DATA.education.map((edu, index) => (
                <div key={index} className="glass-card experience-item">
                  <h3>{edu.degree}</h3>
                  <div className="experience-meta">
                    <span>{edu.school}</span>
                    <span>{edu.duration}</span>
                  </div>
                  {edu.description && <p>{edu.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card">
              <p style={{ margin: 0 }}>NONE</p>
            </div>
          )}
        </section>

        {/* Experience Section */}
        <section id="experience">
          <h2 className="section-title">Experience</h2>
          {hasExperience ? (
            <div className="experience-list">
              {SITE_DATA.experience.map((exp, index) => (
                <div key={index} className="glass-card experience-item">
                  <h3>{exp.role}</h3>
                  <div className="experience-meta">
                    <span>{exp.company}</span>
                    <span>{exp.duration}</span>
                  </div>
                  {exp.description && <p>{exp.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card">
              <p style={{ margin: 0 }}>NONE</p>
            </div>
          )}
        </section>

        {/* Projects Section */}
        <section id="projects">
          <h2 className="section-title">Projects</h2>
          {hasProjects ? (
            <div className="projects-grid">
              {SITE_DATA.projects.map((project, index) => (
                <div key={index} className="glass-card">
                  <h3>{project.title}</h3>
                  {project.description && <p>{project.description}</p>}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="skills-container" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="skill-tag" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>{tech}</span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ display: 'inline-block', width: 'max-content', marginTop: '1rem' }}>
                      View Source
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card">
              <p style={{ margin: 0 }}>NONE</p>
            </div>
          )}
        </section>

        {/* Notes Section */}
        <section id="notes">
          <h2 className="section-title">Notes & Articles</h2>
          {hasNotes ? (
            <div className="projects-grid">
              {SITE_DATA.notes.map((note, index) => (
                <div key={index} className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>{note.title}</h3>
                    {note.date && <span className="text-muted" style={{ fontSize: '0.85rem' }}>{note.date}</span>}
                  </div>
                  {note.description && <p>{note.description}</p>}
                  {note.link && (
                    <a href={note.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ display: 'inline-block', width: 'max-content', marginTop: '1rem' }}>
                      Read on Notion
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card">
              <p style={{ margin: 0 }}>NONE</p>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-container">
          <div className="footer-links visible-mobile">
            {SITE_DATA.github && (
              <a href={SITE_DATA.github} target="_blank" rel="noopener noreferrer" className="header-link" aria-label="GitHub" title="GitHub">
                <ThreeIcon type="github" />
                <span>GitHub</span>
              </a>
            )}
            {SITE_DATA.linkedin && (
              <a href={SITE_DATA.linkedin} target="_blank" rel="noopener noreferrer" className="header-link" aria-label="LinkedIn" title="LinkedIn">
                <ThreeIcon type="linkedin" />
                <span>LinkedIn</span>
              </a>
            )}
            {SITE_DATA.email && (
              <a href={`mailto:${SITE_DATA.email}`} className="header-link" aria-label="Email" title="Email Me">
                <ThreeIcon type="email" />
                <span>Email</span>
              </a>
            )}
            {SITE_DATA.cv && (
              <a href={SITE_DATA.cv} target="_blank" rel="noopener noreferrer" className="header-link" aria-label="CV" title="CV">
                <ThreeIcon type="cv" />
                <span>CV</span>
              </a>
            )}
          </div>
          
          <p className="footer-quote">
            "What I cannot create, I do not understand."<br />
            — Richard Feynman
          </p>

          <p>© {new Date().getFullYear()} {SITE_DATA.hero?.name || "Elijah"}. Built with Next.js, Three.js & a lot of ☕.</p>
        </div>
      </footer>
    </>
  );
}

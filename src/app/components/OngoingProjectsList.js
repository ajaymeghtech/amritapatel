'use client';

import { useState, useEffect } from 'react';
import styles from "@/app/styles/scss/components/ongoing_project.module.scss";

export default function OngoingProjectsList({ subcategories }) {

  if (!subcategories || subcategories.length === 0) {
    return (
      <div className={`${styles.onGoingProjectsSection}`}>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No ongoing projects available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.onGoingProjectsSection}`}>
      <div className="container">
        <ul className={styles.calendarList}>

          {subcategories.map((project) => {
            const projectUrl = project.link || project.link_url || "#";

            return (
              <li key={project._id}>
                <div className={styles.boxCalendar}>
                  <a href={projectUrl} target="_blank" rel="noopener noreferrer">
                    <div className={styles.calendarHeading}>
                      <h3>{project.name}</h3>
                      <svg width="85" height="85" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="35" cy="35" r="34.5" fill="#F5EFE7" stroke="#707070" />
                        <path d="M50.7071 35.7071C51.0976 35.3166 51.0976 34.6834 50.7071 34.2929L44.3431 27.9289C43.9526 27.5384 43.3195 27.5384 42.9289 27.9289C42.5384 28.3195 42.5384 28.9526 42.9289 29.3431L48.5858 35L42.9289 40.6569C42.5384 41.0474 42.5384 41.6805 42.9289 42.0711C43.3195 42.4616 43.9526 42.4616 44.3431 42.0711L50.7071 35.7071ZM20 35V36H50V35V34H20V35Z" fill="#707070" />
                      </svg>
                    </div>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={`${styles.onGoingProjectsSection}`}>
      </div>
    </div>

  );
}






// 'use client';

// import { useState, useEffect } from 'react';
// import styles from "@/app/styles/scss/components/ongoing_project.module.scss";
// import { fetchProjects } from '@/app/services/projectsService';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export default function OngoingProjectsList({ projectId, subcategories }) {
//   const [projects, setProjects] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadProjects = async () => {
//       try {
//         setIsLoading(true);
//         const data = await fetchProjects();
//         // Filter ongoing projects
//         const ongoingProjects = data.filter(project => project.status === 'ongoing');
//         setProjects(ongoingProjects);
//       } catch (err) {
//         console.error('Error loading projects:', err);
//         setError('Failed to load projects');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadProjects();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className={`${styles.onGoingProjectsSection}`}>
//         <div className="container">
//           <div style={{ textAlign: 'center', padding: '2rem' }}>
//             <p>Loading projects...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={`${styles.onGoingProjectsSection}`}>
//         <div className="container">
//           <div style={{ textAlign: 'center', padding: '2rem', color: '#d32f2f' }}>
//             <p>{error}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (projects.length === 0) {
//     return (
//       <div className={`${styles.onGoingProjectsSection}`}>
//         <div className="container">
//           <div style={{ textAlign: 'center', padding: '2rem' }}>
//             <p>No ongoing projects available</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   console.log("Ongoing Projects:", projects,subcategories);

//   return (
//     <div className={`${styles.onGoingProjectsSection}`}>
//       <div className="container">
//         <ul className={styles.calendarList}>
//           {projects.map((project) => (
//             <li key={project._id}>
//               <div className={styles.boxCalendar}>
//                 <a href={project.project_url} target="_blank" rel="noopener noreferrer">
//                   <div className={styles.calendarHeading}>
//                     <h3>{project.project_title}</h3>
//                     <svg width="85" height="85" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <circle cx="35" cy="35" r="34.5" fill="#F5EFE7" stroke="#707070"/>
//                       <path d="M50.7071 35.7071C51.0976 35.3166 51.0976 34.6834 50.7071 34.2929L44.3431 27.9289C43.9526 27.5384 43.3195 27.5384 42.9289 27.9289C42.5384 28.3195 42.5384 28.9526 42.9289 29.3431L48.5858 35L42.9289 40.6569C42.5384 41.0474 42.5384 41.6805 42.9289 42.0711C43.3195 42.4616 43.9526 42.4616 44.3431 42.0711L50.7071 35.7071ZM20 35V36H50V35V34H20V35Z" fill="#707070"/>
//                     </svg>
//                   </div>
//                 </a>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import theme from '../theme';
import LaunchpadList from '../components/LaunchpadList';


export default function Launchpad({ setGlobalLoading, setToast }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setGlobalLoading && setGlobalLoading(true);
    fetch('/api/launchpad/list')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.launchpads)) {
          setProjects(data.launchpads);
        } else {
          setProjects([]);
          setToast && setToast({ message: 'Launchpad verisi alınamadı!', type: 'error' });
        }
        setGlobalLoading && setGlobalLoading(false);
      })
      .catch(err => {
        setToast && setToast({ message: 'Veri alınamadı: ' + err.message, type: 'error' });
        setGlobalLoading && setGlobalLoading(false);
      });
  }, [setGlobalLoading, setToast]);

  return (
    <section style={{padding:'2rem 0',textAlign:'center',background:'var(--bg-main)',minHeight:'60vh'}}>
      <h2 style={{color:'var(--accent-cyan)',fontSize:'2.2rem',marginBottom:12}}>Launchpad</h2>
      {!projects.length && <div style={{color:'var(--accent-blue)',fontSize:20,margin:'2rem'}}>Yükleniyor...</div>}
      {projects.length > 0 && (
        <>
          <LaunchpadList projects={projects} />
          <p style={{color:'var(--text-muted)',fontSize:'1.1rem'}}>Projeler ve aktif launchpad listesi burada görünecek.</p>
        </>
      )}
      {projects.length === 0 && (
        <div style={{color:'var(--warning)',fontSize:18,margin:'2rem'}}>Henüz aktif launchpad yok.</div>
      )}
    </section>
  );
}

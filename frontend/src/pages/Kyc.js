import React from 'react';
import KycForm from '../components/KycForm';

export default function KycPage() {
  return (
    <section style={{padding:'2rem 0',textAlign:'center',background:'var(--bg-main)',minHeight:'60vh'}}>
      <h2 style={{color:'var(--accent-green)',marginBottom:24}}>KYC Başvuru</h2>
      <KycForm />
    </section>
  );
}

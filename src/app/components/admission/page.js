import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';

export default function AdmissionPage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '24px', color: '#0d4a63' }}>
            Admission
          </h1>
          <p style={{ fontSize: '18px', color: '#1a5f7a', lineHeight: '1.7' }}>
            Find all information about admission procedures, requirements, and important dates for enrollment.
          </p>
          <div style={{ marginTop: '40px' }}>
            <p style={{ color: '#6b7280' }}>Content coming soon...</p>
          </div>
        </div>
      </main>
    </>
  );
}


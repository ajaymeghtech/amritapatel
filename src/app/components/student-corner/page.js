import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';

export default function StudentCornerPage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '24px', color: '#0d4a63' }}>
            Student Corner
          </h1>
          <p style={{ fontSize: '18px', color: '#1a5f7a', lineHeight: '1.7' }}>
            Access student resources, portals, and services designed to support your academic journey.
          </p>
          <div style={{ marginTop: '40px' }}>
            <p style={{ color: '#6b7280' }}>Content coming soon...</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


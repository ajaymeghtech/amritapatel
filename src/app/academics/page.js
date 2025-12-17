import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "../components/common/innerbanner";


export default function AcademicsPage() {
  return (
    <>
      <Header />
      {/* <Innerbanner title="Academics" image="/path/to/academics-banner.jpg" /> */}
      <main style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '24px', color: '#0d4a63' }}>
            Academics
          </h1>
          <p style={{ fontSize: '18px', color: '#1a5f7a', lineHeight: '1.7' }}>
            Explore our academic programs, courses, and educational offerings designed to shape healthcare leaders.
          </p>
          <div style={{ marginTop: '40px' }}>
            <p style={{ color: '#6b7280' }}>Content coming soon...</p>
          </div>
        </div>
      </main>
    </>
  );
}


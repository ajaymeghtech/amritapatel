import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Home from "@/app/Home";
import '@/app/styles/scss/main.scss';

export default function HomePage() {
  return (
    <>
      <main style={{ minHeight: '100vh', paddingTop: 0, marginTop: 0 }}>
         <Header /> 
        <Home />
      </main>
    </>
  );
}

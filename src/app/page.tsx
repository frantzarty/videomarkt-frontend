import Hero from "@/app/hero/hero";
import Header from "@/app/header/header";
import ServiceGrid from "@/app/service-grid/service-grid";
import './app.css'

export default function Home() {
  return (
      <div className="main-container">
        <Header/>
        <Hero/>
        <ServiceGrid/>
      </div>
  );
}

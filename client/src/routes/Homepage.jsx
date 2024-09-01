import Header from "../components/Header";
import ButtonGradient from "../assets/svg/ButtonGradient";
import Benefits from "../components/Benefits";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Pricing from "../components/Pricing";
const Homepage = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Benefits />
        <Pricing />
        <Footer />
      </div>

      <ButtonGradient />
    </>
  );
};

export default Homepage;

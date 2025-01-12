import React from "react";
import Navbar from "~/components/landing-page/Navbar";
import HeroSection from "~/components/landing-page/HeroSection";
import Partners from "~/components/landing-page/Partners";
import Footer from "~/components/layout/Footer";
import MapSignup from "~/components/layout/MapSignup";
import Banner from "~/components/landing-page/Banner";
import Services from "~/components/landing-page/Services";

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Banner />
      <Partners />
      <Services />
      <MapSignup />
      <Footer />
    </>
  );
};

export default Home;

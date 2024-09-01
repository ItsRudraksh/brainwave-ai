import { heroBackground } from "../assets";
import Section from "./Section";
import { BackgroundCircles, BottomLine } from "./design/Hero";
import { useRef } from "react";

const HeroMini = ({ children }) => {
  const parallaxRef = useRef(null);
  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      ḍ
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative" ref={parallaxRef}>
        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          {children}
          <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
            <img
              src={heroBackground}
              className="w-full"
              width={1440}
              height={1800}
              alt="hero"
            />
          </div>
          <BackgroundCircles />
        </div>
      </div>
      <BottomLine />
    </Section>
  );
};

export default HeroMini;

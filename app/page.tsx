import Hero from "@/components/Home/Hero/Hero";
import HomeGallery from "@/components/Home/HomeGallery/HomeGallery";
import Service from "@/components/Home/Service/Service";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <Hero/>
      <HomeGallery/>
      <Service/>
    </div>
  );
}

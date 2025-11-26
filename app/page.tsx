import Hero from "@/components/Home/Hero/Hero";
import HomeGallery from "@/components/Home/HomeGallery/HomeGallery";
import RecentBlog from "@/components/Home/RecentBlog/page";
import RecentPrograms from "@/components/Home/RecentPrograms/page";
import Service from "@/components/Home/Service/Service";

import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <Hero/>
      <Service/>
      <RecentPrograms/>
      <RecentBlog/>
      <HomeGallery/>
    </div>
  );
}

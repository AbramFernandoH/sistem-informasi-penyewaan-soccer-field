import PwaLayout from "@/layouts/pwa";
import Header from "@/components/home/Header";
import AboutUs from "@/components/home/AboutUs";
import OurFields from "@/components/home/OurFields";

export default function Home() {


  return (
    <PwaLayout>
      <Header />

      <AboutUs />

      <OurFields />
    </PwaLayout>
  );
}

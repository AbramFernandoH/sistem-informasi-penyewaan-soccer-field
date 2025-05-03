import {FC, ReactNode} from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type PwaLayoutProps = {
  children: ReactNode
}

const PwaLayout: FC<PwaLayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />

      {children}

      <Footer />
    </div>
  );
};

export default PwaLayout;
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen w-11/12 mx-auto">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;

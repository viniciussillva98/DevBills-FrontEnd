import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="grow py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;

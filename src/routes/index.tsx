import { BrowserRouter, Route, Routes } from "react-router";
import { ToastContainer, type ToastContainerProps } from "react-toastify";
import Dashboard from "../containers/Dashboard";
import Home from "../containers/Home";
import Login from "../containers/Login";
import Transactions from "../containers/Transactions";
import TransactionsForm from "../containers/TransactionsForm";
import AppProvider from "../context";
import AppLayout from "../layouts/AppLayout";
import PrivateRoutes from "./privateRoutes";

const AppRoutes = () => {
  const toastConfig: ToastContainerProps = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
  };

  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="*" element={<h1>PÁGINA NÃO ENCONTRADA</h1>} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoutes />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transacoes" element={<Transactions />} />
              <Route path="/transações/nova-transação" element={<TransactionsForm />} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer {...toastConfig} />
      </AppProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;

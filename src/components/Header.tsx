import { Activity, LogIn, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

interface NavLink {
  name: string;
  path: string;
}

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { authState, signOut } = useAuth();

  const { pathname } = useLocation();

  const isAuthenticated: boolean = !!authState.user;

  const navLink: NavLink[] = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transações", path: "/transacoes" },
  ];

  const handleSingnOut = (): void => {
    if (typeof signOut === "function") {
      setIsOpen(false);
      signOut();
    }
  };

  const changeMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const renderAvatar = () => {
    //se não estiver logado.
    if (!authState.user) return null;

    //se estiver logado e ter foto no perfil.
    if (authState.user.photoURL) {
      return (
        <img
          src={authState.user.photoURL}
          alt={`Foto de perfil de ${authState.user.displayName}`}
          className="w-8 h-8 rounded-full border border-gray-700"
        />
      );
    }

    //se estiver logado e não ter foto no perfil, pega a primeira letra do nome.
    return (
      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-primary-500 font-medium">
        {authState.user.displayName?.charAt(0)}
      </div>
    );
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <div className="Container-app">
        <div className="flex justify-between items-center py-4">
          {/* LOGO */}
          <Link to={"/"} className="flex gap-2 text-xl text-primary-500 items-center font-semibold">
            <Activity />
            DevBills
          </Link>
          {/* MENU DESKTOP */}
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-3">
              {navLink.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={
                    pathname === link.path
                      ? "text-primary-500 border border-primary-500 rounded-2xl py-1 px-3"
                      : "text-gray-400 border border-gray-400 rounded-2xl py-1 px-3"
                  }
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}
          {/* AVATAR */}
          <div>
            {isAuthenticated ? (
              <div className="hidden md:flex items-center justify-center gap-2">
                {renderAvatar()} <span className=" text-gray-400">{authState.user?.displayName}</span>
                <button type="button" onClick={handleSingnOut}>
                  <LogOut className="w-5 h-5 cursor-pointer text-gray-400 hover:text-red-600 transition-colors" />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <LogIn className=" text-gray-400 hover:text-primary-500" />
              </Link>
            )}
          </div>
          {/* BOTÃO MENU MOBILE */}
          <div className="md:hidden flex items-center">
            <button type="button" className=" text-gray-400" onClick={changeMenu}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* SIDEBAR MOBILE - AGORA LATERAL */}
      {isOpen && (
        <>
          {/* OVERLAY */}
          <button
            type="button"
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setIsOpen(false);
            }}
            aria-label="Fechar menu"
            tabIndex={0}
            style={{ border: "none", background: "transparent", padding: 0 }}
          />

          {/* SIDEBAR */}
          <div
            className="
              fixed top-0 right-0 z-50 h-full w-64 bg-gray-900 border-r border-gray-700
              transform translate-x-0 transition-transform duration-300 md:hidden
            "
          >
            {/* HEADER SIDEBAR */}
            <div className="flex items-center justify-end px-4 h-10 ">
              <button type="button" className="text-gray-400" onClick={() => setIsOpen(false)}>
                <X size={22} />
              </button>
            </div>

            {/* NAV SIDEBAR */}
            <div className="p-3">
              {isAuthenticated ? (
                <nav className="space-y-1">
                  <div className="flex items-center justify-center gap-2 text-gray-400 mb-3 ">
                    {renderAvatar()}
                    <span>{authState.user?.displayName}</span>
                  </div>
                  <div className="flex items-center justify-center pb-2 text-gray-500 text-xs">
                    <span>{authState.user?.email}</span>
                  </div>
                  {navLink.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`
                        block rounded-lg py-2 px-3 transition-colors
                        ${
                          pathname === link.path
                            ? "text-primary-500 bg-primary-500/10"
                            : "text-gray-400 hover:bg-gray-800"
                        }
                      `}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              ) : (
                <Link to="/login" className="text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              )}
            </div>

            {/* FOOTER */}
            {isAuthenticated && (
              <div className="absolute bottom-0 w-full border-t border-gray-700 p-3">
                <button
                  type="button"
                  onClick={handleSingnOut}
                  className="flex items-center gap-2 text-gray-400 hover:text-red-500"
                >
                  <LogOut size={18} />
                  Sair
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Header;

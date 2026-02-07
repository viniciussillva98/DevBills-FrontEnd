const Footer = () => {
  const curreentDate = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 py-3 border-t border-gray-700">
      <div className="Container-app">
        <p className="text-sm text-center text-gray-400">
          Dev Bills {curreentDate} - Desenvolvido por <strong>Vinícius Silva</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

function Footer() {
  return (
    <footer className="bg-[#1F2E2E] hover:text-[#30E3CA] transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <p>&copy; {new Date().getFullYear()} MyApp - All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-[#30E3CA] transition-colors duration-300">Twitter</a>
          <a href="#" className="hover:text-[#30E3CA] transition-colors duration-300">Facebook</a>
          <a href="#" className="hover:text-[#30E3CA] transition-colors duration-300">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
export default Footer;

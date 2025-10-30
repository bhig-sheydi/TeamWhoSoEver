import DarkModeToggle from "./DarkModeToggle";
import logo from "../assets/logo2.png";

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 w-full z-20 bg-transparent p-4 text-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={logo} className="w-12 rounded-full" alt="Logo" />
        </div>
        <DarkModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;

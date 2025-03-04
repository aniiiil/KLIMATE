import { useTheme } from "@/context/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import CitySearch from "@/components/city-search";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className=" sticky top-0 z-50 py-2 w-full  border-b bg-background/95 backdrop-blur  supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-8">
        <Link to={"/"}>
          <img
            src={isDark ? "./logo.png" : "./logo2.png"}
            alt="Klymate logo"
            className={`${isDark ? "h-20" : "h-[5.6rem]"}`}
          />
        </Link>

        <div className="flex gap-4">
          <CitySearch />

          {/* toggle theme  */}
          <div
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`flex items-center cursor-pointer transition-transform duration-500 ${
              isDark ? "rotate-180" : "rotate-0"
            }`}
          >
            
            {isDark ? (
              <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all" />
            ) : (
              <Moon className="h-6 w-6 text-blue-500 rotate-0 transition-all" />
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

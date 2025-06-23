import Image from "next/image";
import LogoIconWhite from "../../public/img/philippe_chevrier_officiel_logo_white.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

export const Footer = ({ items }) => {
  return (
    <footer className="pb-[110px] sm:pb-0">
      <div className="bg-[#4C4442] bg-opacity-95 text-neutral-50 ">
        <div className="container mx-auto px-5 py-10">
          {/* Logo centré */}
          <div className="flex justify-center mb-8">
            <a href="/" title="Philippe Chevrier - Home" className="opacity-80">
              <Image
                priority
                src={LogoIconWhite}
                height={90}
                width={260}
                className="w-logo-sm sm:w-logo-md lg:w-logo-lg h-auto"
                alt="Philippe Chevrier"
              />
            </a>
          </div>
          
          {/* Menu centré */}
          <nav className="opacity-80">
            <ul className="flex flex-col lg:flex-row justify-center space-y-4 lg:space-y-0 lg:space-x-8 text-center">
              {(items || []).map((item) => (
                <li key={item.id}>
                  <a
                    href={item.destination?.url}
                    className="font-lato hover:underline transition-all duration-300 uppercase tracking-wider text-sm"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://www.linkedin.com/company/groupe-philippe-chevrier-suisse/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Suivez-nous sur LinkedIn"
                  className="text-neutral-50 hover:text-[#0077B5] transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Signature avec fond plein */}
      <div className="bg-[#4C4442] text-neutral-50">
        <p className="text-sm opacity-20 p-4 text-center">
          Made with ❤️ by <a href="https://davydav.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Davy Dauteuil</a>
        </p>
      </div>
    </footer>
  );
}
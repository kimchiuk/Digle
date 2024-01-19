import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black bg-opacity-70 text-white">
      <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
        <p className="text-white text-sm text-center sm:text-left">
          © {new Date().getFullYear()} Digle —
          <a
            href="https://twitter.com/digle"
            rel="noopener noreferrer"
            className="text-white ml-1"
            target="_blank"
          >
            @digle
          </a>
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
          <Link to="/about" className="text-white">
            About
          </Link>
          <Link to="/terms" className="ml-4 text-white">
            Terms
          </Link>
          <Link to="/privacy" className="ml-4 text-white">
            Privacy
          </Link>
        </span>
      </div>
    </footer>
  );
};

export default Footer;

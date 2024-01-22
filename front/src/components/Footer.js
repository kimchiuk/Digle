import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black bg-opacity-70 text-white">
      <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row px-48">
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
        <br/><br/>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
          <p>
            Digle은 Digital (디지털)과 Eagle (독수리)의 합성어로, 독수리가
            날카로운 시력으로 먼 거리의 사물을 정확하게 식별하는 것처럼,
            <br/>
            디지털 기술로 사용자의 정체성을 명확하고 정확하게
            인식한다는 의미를 가질 수 있습니다.
          </p>
        </span>
      </div>
    </footer>
  );
};

export default Footer;

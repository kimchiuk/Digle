import React, { useState } from "react";
import { Link } from "react-router-dom"
import ServiceTerms from "./ServiceTerms";
import "../App.css";
import Modal from "./Modal";

const Footer = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <footer>
      <div className="bg-gray-900 text-white text-center p-4">
        <h4 className="font-medium">
          온라인 시험 신분증 검사
          <span className="text-sky-500"> AI로 간편하게 </span>
          비교하세요.
        </h4>
      </div>
      <div className="bg-gray-800 text-gray-400 font-medium pl-[20%] text-sm py-2">
        <p className="text-white text-sm text-center sm:text-left mb-2">
          © {new Date().getFullYear()} Digle —
          <Link
            to="/"
            rel="noopener noreferrer"
            className="text-white ml-1"
            target="_blank"
          >
            @digle
          </Link>
        </p>

        <div>
          <p onClick={handleOpenModal}>
            <span className="cursor-pointer">서비스 이용약관</span>
          </p>
          <Modal isOpen={modalOpen} onClose={handleCloseModal}>
            <ServiceTerms />
          </Modal>
        </div>

        <div>
          <p>고객센터 | gumid107@gmail.com</p>
          <p>광고문의 | gumid107@gmail.com</p>
          <p>제휴 및 대외 협력 | https://google.co.kr/ · Google</p>
          <p>(주) Digle 대표 복영석</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

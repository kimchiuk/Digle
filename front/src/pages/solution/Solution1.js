import React, { useState } from "react";
import { Link } from "react-router-dom";

const FAQ_DATA = [
  { question: "이 서비스를 이용해야 하는 이유는 무엇인가요?", answer: "저도 모르겠어요." },
  { question: "로그인에 실패했습니다.", answer: "저도 모르겠어요." },
  { question: "회원 가입이 안 됩니다.", answer: "저도 모르겠어요." },
  { question: "서비스가 켜지지 않습니다.", answer: "저도 모르겠어요." },
  { question: "신분증 업로드에 실패했습니다.", answer: "저도 모르겠어요." },
  { question: "연결에 실패했습니다.", answer: "저도 모르겠어요." },
  { question: "마이크 소리가 안 나옵니다.", answer: "저도 모르겠어요." },
  { question: "동일인물인데 다른 사람이라고 나와요.", answer: "저도 모르겠어요." },
  { question: "테스트 도중에 서비스가 끊겼어요", answer: "저도 모르겠어요." },
  { question: "Digle에서 제공하는 두 서비스의 차이는 무엇인가요?", answer: "저도 모르겠어요." },
];

const ITEMS_PER_PAGE = 5;

const Solution1 = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedItem, setExpandedItem] = useState(null);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = FAQ_DATA.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedItem(null); // 현재 열린 항목 닫기
  };

  return (
    <div className="px-20 pt-16 pb-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold pt-2 pb-2 mt-4 mb-6">자주 묻는 질문</h2>

      {currentItems.map((item, index) => (
        <div key={index} className="mb-4">
          <div
            className={`${expandedItem === index ? "bg-blue-100" : "bg-gray-100"} p-4 cursor-pointer rounded-md flex justify-between items-center`}
            onClick={() => setExpandedItem(expandedItem === index ? null : index)}
          >
            <h3 className="text-lg font-semibold">Q . <span className="ml-2">{item.question}</span></h3>
            {expandedItem === index ? (
              <span className="text-blue-500">&#x25B2;</span>
            ) : (
              <span className="text-blue-500">&#x25BC;</span>
            )}
          </div>
          {expandedItem === index && (
            <div className="bg-white p-4 mt-2 rounded-md shadow">
              <p className="ml-2">A .<span className="ml-2">{item.answer}</span></p>
            </div>
          )}
        </div>
      ))}
      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        {[...Array(Math.ceil(FAQ_DATA.length / ITEMS_PER_PAGE)).keys()].map((page, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-md ${currentPage === index + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
              }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* FAQ 페이지로 이동하는 버튼 */}
      <div className="mt-4 text-center">
        <Link to="/solution/2/" className="m-5 text-blue-500 underline">
          원하시는 답을 찾지 못하셨나요?
        </Link>
      </div>
    </div>
  );
};

export default Solution1;

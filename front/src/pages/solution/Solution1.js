import React, { useState } from "react";
import { Link } from "react-router-dom";

const FAQ_DATA = [
  { question: "이 서비스를 이용해야 하는 이유는 무엇인가요?", answer: "Digle은 강력한 기능과 편리한 사용성을 통해 사용자들에게 탁월한 경험을 제공합니다. 안정적이고 다양한 기능들을 통해 여러분의 요구를 충족시켜 드릴 것입니다." },
  { question: "로그인에 실패했습니다.", answer: "로그인 문제가 발생했다면 먼저 입력한 정보가 정확한지 확인해주세요. 비밀번호를 잊으셨다면 '비밀번호 찾기' 옵션을 사용하여 비밀번호를 초기화할 수 있습니다." },
  { question: "회원 가입이 안 됩니다.", answer: "회원 가입이 어려운 경우, 필수 정보를 정확하게 입력했는지 확인하세요. 또한, 이미 가입된 이메일인지 확인하고 다른 이메일을 시도해보세요." },
  { question: "서비스가 켜지지 않습니다.", answer: "서비스가 시작되지 않을 때에는 네트워크 연결을 확인하고, 최신 버전의 브라우저를 사용하는지 확인해주세요. 또한, 서버 점검이나 장애 여부를 확인해보세요." },
  { question: "신분증 업로드에 실패했습니다.", answer: "신분증 업로드에 문제가 있다면, 파일이 올바른 형식인지 확인하세요. 지원되는 파일 형식에 맞게 신분증을 업로드해주세요." },
  { question: "연결에 실패했습니다.", answer: "연결에 실패한 경우, 네트워크 연결을 확인하고 해당 서비스의 연결 상태를 확인하세요. 정상적으로 연결되어 있지 않다면 서비스 제공자에게 문의하세요." },
  { question: "마이크 소리가 안 나옵니다.", answer: "마이크 소리가 들리지 않을 때에는 마이크가 정상적으로 연결되어 있는지 확인하세요. 또한, 브라우저의 마이크 권한 설정도 확인해보세요." },
  { question: "동일인물인데 다른 사람이라고 나와요.", answer: "동일인물에 대한 문제가 발생했다면, 계정 설정 및 정보를 정확하게 입력했는지 확인하세요. 계정이 다른 사용자와 혼동되지 않도록 주의하세요." },
  { question: "테스트 도중에 서비스가 끊겼어요", answer: "테스트 중에 서비스가 중단된 경우, 네트워크 연결 상태를 확인하고 서비스 제공자의 공지사항을 참고하여 장애 여부를 확인하세요." },
  { question: "Digle에서 제공하는 두 서비스의 차이는 무엇인가요?", answer: "Digle은 Test 서비스와 Conference 서비스 두 가지를 제공하고 있습니다. Test는 A/B 테스트 및 사용자 행동 분석을 위한 도구로, Conference는 온라인 회의 및 협업 도구로 사용됩니다. 각 서비스는 고유한 목적과 기능을 가지고 있습니다." },
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
    <div className="px-20 h-auto pt-16 pb-4 max-w-2xl mx-auto">
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

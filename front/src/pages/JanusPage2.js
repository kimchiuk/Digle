import React, { useEffect, useState } from "react";
import Janus from "../utils/janus";
export default function Yanus() {
  const [janus, setJanus] = useState(null);

  useEffect(() => {
    // Janus 라이브러리 초기화 및 세션 생성
    let janusInstance = null;
    Janus.init({
      debug: "all",
      callback: () => {
        janusInstance = new Janus({
          server: "ws://localhost:8188",
          success: () => {
            // 세션 연결 성공
            console.log("Janus 연결 성공");
            setJanus(janusInstance);
          },
          error: (error) => {
            // 오류 처리
            console.error("Janus 에러:", error);
          },
          destroyed: () => {
            // 세션 종료 처리
            console.log("세션 종료");
          },
        });
      },
    });

    return () => {
      if (janus) {
        janus.destroy();
      }
    };
  }, []);

  return <div className="">{/* UI 컴포넌트 */}</div>;
}

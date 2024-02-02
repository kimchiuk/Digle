import React, { useState, useEffect, useRef } from "react";

const Chatting = (props,{base64}) => {
  const [chatData, setChatData] = useState([]);
  const [inputChat, setInputChat] = useState(""); //대화창내용변경
  const [seletecedFile, setSeletecedFile] = useState(null); //파일고르기

  const handleChange = (e) => {
    setInputChat(e.target.value);
  };


  //엔터키요
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleClick(); 
    }
  };


  //내가 너희들에게 대화를 뿌려줄게
  const handleClick = () => {
    props.sendChatData(inputChat);// q부모컴포넌트에게 inputChat 전송
    setChatData((prev) => [...prev, `나 : ${inputChat}`]);  
    setInputChat("");
  };
 

  //대화가 올때마다 반응하게
  useEffect(() => {
    setChatData((prev) => [...prev, props.receiveChat]);
  }, [props.receiveChat]);


  const chunkSize = 16384; // 청크 크기를 16KB로 설정

const handleFileTransfer = () => {
  if (!seletecedFile) {
    alert("파일을 선택해주세요");
    return;
  }
  const file = seletecedFile;
  let offset=0;


  if (file.size > 10485760) { 
    alert("10mb미만으로만 올리쇼");
    return;
  }

  setChatData((prev) => [...prev, `나 : "${file.name}" 파일을 전송합니다`]); // 채팅창에 메시지 추가


  const readAndSendChunk = () => {
    const reader = new FileReader();
    const nextChunk = file.slice(offset, offset + chunkSize);
    reader.onload = (e) => {
      props.transferFile({
        filename: file.name,
        data: e.target.result,
        last: offset + chunkSize >= file.size
      });
      offset += chunkSize;
      if (offset < file.size) {
        readAndSendChunk(); // 다음 청크 읽기
      }
    };
    reader.readAsArrayBuffer(nextChunk);
  };
  readAndSendChunk(); // 첫 청크 읽기 시작
};



function base64ToArrayBuffer(base64) {
  try {
      var binaryString = window.atob(base64);
      var bytes = new Uint8Array(binaryString.length);
      for (var i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
  } catch (error) {
      console.error('Base64 decoding failed:', error);
      // 적절한 에러 처리 로직 추가
  }
}



  ///recive용
  const createFileChat = (data, filename, from) => {
    const arrayBuffer = base64ToArrayBuffer(data); // 이 함수는 별도로 구현 필요
    const blob = new Blob([arrayBuffer], {type: "application/octet-stream"});
    const url = window.URL.createObjectURL(blob);
  
    return (
      <>
        {from} : <a href={url} download={filename}>{filename}</a>
      </>
    );
  };

  useEffect(() => {
    if (!props.receiveFile) return;
    let filename = props.receiveFile.filename;
    let data = props.receiveFile.data;
    let from = props.receiveFile.from;
    console.log(props.receiveFile);
    setChatData((prev) => [...prev, createFileChat(data, filename, from)]);
  }, [props.receiveFile]); //데이터나 채팅이나 오면 누구한테 온지까지 =?> chatdata에 새롭게 박아넣기

  const handleSelectedFile = (e) => {
    setSeletecedFile(() => e.target.files[0]);
  };
/////recive용


  //채팅
  const renderChatData = chatData.map((c, i) => { //채팅창에 setChatData [입력된 채팅 내용] 형태로 전송 
    return <p key={i}> {c} </p>;
  });


  return (
    <>
      <div
        style={{
          border: "1px solid",
          overflow: "auto",
          minHeight: "500px",
        }}
      >
        {renderChatData}
      </div>

      <input
        type="text"
        value={inputChat}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        style={{ border: "1px solid" }}
      />
      <button onClick={handleClick}>전송</button>
      <input onChange={handleSelectedFile} type="file" />
      <button onClick={handleFileTransfer}>파일 전송</button>
    </>
  );
};

export default Chatting;

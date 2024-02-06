import React, { useState, useEffect, useRef } from "react";
import sendButton from "../../../assets/webRTC/sendButton.png";
import chatImg from "../../../assets/webRTC/chat.png";
import attachment from "../../../assets/webRTC/attachment.png";

const Chatting = (props) => {
  const [chatData, setChatData] = useState([]);
  const [inputChat, setInputChat] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    setInputChat(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  const handleClick = () => {
    props.sendChatData(inputChat);
    setChatData((prev) => [...prev, `안현성 ${inputChat}`]);
    setInputChat("");
  };

  useEffect(() => {
    if (props.receiveChat) {
      const { from, text, to } = props.receiveChat;
      // 현재 사용자가 메시지의 수신자이거나, 메시지가 모두에게 보내진 경우에만 표시
      if (to === "all" || to === props.username) {
        let messageToShow;
        if (to === "all") {
          // 모두에게 보낸 메시지
          messageToShow = `${from}: ${text}`;
        } else {
          // 귓속말
          messageToShow = `귓속말 (${from} -> ${to}): ${text}`;
        }
        setChatData((prev) => [...prev, messageToShow]);
      }
    }
  }, [props.receiveChat, props.username]);
  

  useEffect(() => {
    console.log(props.receiveChat);
  }, [props.receiveChat]);

  // useEffect(() => {
  //   setChatData((prev) => [...prev, props.receiveChat]);
  // }, [props.receiveChat]);

  const handleFileTransfer = () => {
    if (!selectedFile) {
      alert("파일을 선택해주세요");
      return;
    }
    const file = selectedFile;
    const chunkLength = 16384;
    
    const fileTransferMessage = `[${file.name}] 전송하였습니다.`;
    setChatData((prev) => [...prev, `${fileTransferMessage}`]);

    const onReadAsDataURL = (event, text) => {
      var data = {}; // data object to transmit over data channel
      data.filename = file.name;
      if (event) text = event.target.result; // on first invocation

      if (text.length > chunkLength) {
        data.message = text.slice(0, chunkLength); // getting chunk using predefined chunk length
      } else {
        data.message = text;
        data.last = true;
      }
      props.transferFile(data); // use JSON.stringify for chrome!

      var remainingDataURL = text.slice(data.message.length);
      if (remainingDataURL.length)
        setTimeout(function () {
          onReadAsDataURL(null, remainingDataURL); // continue transmitting
        }, 500);
    };

    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener("load", onReadAsDataURL);
  };

  const createFileChat = (data, filename, from) => {
    return (
      <>
        {from} :{" "}
        <a href={data} download={filename}>
          {filename}
        </a>
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
  }, [props.receiveFile]);

  const handleSelectedFile = (e) => {
    setSelectedFile(() => e.target.files[0]);
  };

  const renderChatData = chatData.map((c, i) => {
    return (
      <p
        className="pl-2 pt-2 text-xs overflow-wrap[break-word] text-stone-500"
        key={i}
      >
        {" "}
        {c}{" "}
      </p>
    );
  });

  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatData]);

  return (
    <div>
      <div
        ref={chatBoxRef}
        className="border overflow-x-hidden overflow-y-auto min-h-[500px] max-h-[500px]"
      >
        <div className="sticky top-0 bg-white">
          <div className="right-0 p-2 text-sm font-bold text-stone-400 flex items-center">
            <img className="w-10 h-10" src={chatImg} />
            채팅창
          </div>
          <hr />
        </div>
        {renderChatData}
      </div>

      <div className="mt-2 flex items-center">
        <input
          className="border-b-2 focus:outline-none focus:ring-1 focus:ring-gray-300 mr-3 text-xs p-2 w-11/12"
          placeholder="채팅..."
          type="text"
          value={inputChat}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />

        <button className="mt-1" onClick={handleClick}>
          <img className="w-5 h-5" src={sendButton} />
        </button>
      </div>
      <div className="mt-3 flex items-center">
        <label className="flex items-center">
          <img className="w-6 h-6" src={attachment} />
          <input type="file" className="hidden" onChange={handleSelectedFile} />
        </label>
        <button
          className="border p-1 rounded-md text-xs font-bold"
          onClick={handleFileTransfer}
        >
          파일 전송
        </button>
      </div>
    </div>
  );
};

export default Chatting;

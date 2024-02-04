import React, { useState, useEffect } from "react";

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
    setChatData((prev) => [...prev, `나 : ${inputChat}`]);
    setInputChat("");
  };

  useEffect(() => {
    if (props.receiveChat) {
      const { from, text, to } = props.receiveChat;
      console.log(from,to,text,props.username);
      // 현재 사용자가 메시지의 수신자이거나, 메시지가 모두에게 보내진 경우에만 표시
      if (to === "all" || to === props.username) {
        console.log(to);
        const messageToShow = `${from}: ${text}`;
        setChatData(prev => [...prev, messageToShow]);
      }
    }
  }, [props.receiveChat]);

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
    return <p key={i}> {c} </p>;
  });

  return (
    <>
      <div style={{ border: "1px solid", overflow: "auto", minHeight: "500px" }}>
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
import axios from "axios";
import { useState, useEffect } from "react";
import { getSpeech } from "./utils/getSpeech";

const TTS = () => {
  const [value, setValue] = useState("안녕하세요");
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  //음성 변환 목소리 preload
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const handleInput = (e) => {
    const { value } = e.target;
    setValue(value);
  };

  const sendMessage = () => {
    const formData = new FormData();
    formData.append("msg", value);

    axios
      .post(`${API_URL}/tts`, formData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // const handleButton = () => {
  //   getSpeech(value);
  // };
  return (
    <>
      <div className="box">
        <input onChange={handleInput} value={value} />
        <button onClick={sendMessage}>음성 변환</button>
      </div>
    </>
  );
};

export default TTS;

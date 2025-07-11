import React, { useState, useEffect } from "react";
import ko from "./locales/ko.json";

// 결과 매칭 함수 (답변 인덱스 합을 8로 나눈 나머지)
function getResultIndex(answers) {
  const sum = answers.reduce((a, b) => a + b, 0);
  return sum % ko.results.length;
}

function HpProgressBar({ progress }) {
  return (
    <div style={{
      width: "90%",
      height: "24px",
      background: "#f3e7e9",
      borderRadius: "16px",
      boxShadow: "inset 0 2px 8px #e0a8b0",
      margin: "24px auto 32px auto",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        height: "100%",
        width: `${progress}%`,
        background: "linear-gradient(90deg, #ff6a6a 0%, #ffb6b6 100%)",
        borderRadius: "16px 0 0 16px",
        boxShadow: "0 0 16px #ff6a6a88",
        transition: "width 0.5s cubic-bezier(.4,2,.6,1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end"
      }}>
        <span style={{ marginRight: "10px", fontSize: "1.2rem" }}>❤️</span>
      </div>
      <span style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        fontWeight: 700,
        color: "#d35c7a",
        fontSize: "1.1rem",
        textShadow: "0 1px 2px #fff",
        pointerEvents: "none"
      }}>
        {ko.hp} {progress}%
      </span>
    </div>
  );
}

function App() {
  const [step, setStep] = useState("start"); // start, quiz, loading, result
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResultBtn, setShowResultBtn] = useState(false);
  const [resultIdx, setResultIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const totalQ = ko.questions.length;
  const progress = Math.round((qIdx / totalQ) * 100);

  useEffect(() => {
    if (qIdx === totalQ) {
      setTimeout(() => setShowResultBtn(true), 400);
    }
  }, [qIdx, totalQ]);

  function calcResult() {
    setResultIdx(getResultIndex(answers));
  }

  function handleCopyResultUrl() {
    navigator.clipboard.writeText(window.location.href);
    alert("결과 페이지 URL이 복사되었습니다!");
  }

  function handleCopyAppUrl() {
    navigator.clipboard.writeText(window.location.origin);
    alert("앱 주소가 복사되었습니다!");
  }

  function handleCopyMeme(phrase) {
    navigator.clipboard.writeText(phrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  const result = ko.results[resultIdx];

  return (
    <div style={{
      width: "100vw",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8f6ff 0%, #ffe8f3 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Pretendard', 'Arial', sans-serif"
    }}>
      {/* 시작 화면 */}
      {step === "start" && (
        <div style={{
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div
            style={{
              width: "500px",
              height: "700px",
              borderRadius: "22px",
              boxShadow: "0 2px 16px #f4b9d4",
              overflow: "hidden",
              cursor: "pointer",
              background: "#fff",
              position: "relative",
              margin: "0 auto"
            }}
            onClick={() => setStep("quiz")}
            title="이미지를 클릭하면 시작!"
          >
            <img
              src="../assets/main_start.png"
              alt="메인 일러스트"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block"
              }}
            />
          </div>
        </div>
      )}

      {/* 퀴즈 화면 */}
      {step === "quiz" && (
        <div style={{ width: "100%", marginTop: 24 }}>
          <HpProgressBar progress={progress} />
          {qIdx < totalQ && (
            <div style={{
              background: "#fff",
              borderRadius: "18px",
              boxShadow: "0 2px 12px #f4b9d4",
              padding: "36px 18px",
              margin: "0 0 24px 0",
              maxWidth: 500,
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto"
            }}>
              <div style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#d35c7a",
                marginBottom: 32
              }}>
                {ko.questions[qIdx].question}
              </div>
              {ko.questions[qIdx].options.map((opt, i) => (
                <button
                  key={i}
                  style={{
                    width: "100%",
                    background: "#ffe8f3",
                    border: "none",
                    borderRadius: "16px",
                    padding: "16px",
                    marginBottom: "16px",
                    fontSize: "1.1rem",
                    color: "#a45c7a",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                  onClick={() => {
                    setAnswers([...answers, i]);
                    setQIdx(qIdx + 1);
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* HP 100%시 결과 버튼 등장 */}
          {qIdx === totalQ && (
            <div style={{
              opacity: showResultBtn ? 1 : 0,
              transform: showResultBtn ? "scale(1)" : "scale(0.8)",
              transition: "opacity 0.7s cubic-bezier(.4,2,.6,1), transform 0.7s cubic-bezier(.4,2,.6,1)",
              pointerEvents: showResultBtn ? "auto" : "none",
              margin: "36px 0 0 0",
              display: "flex",
              justifyContent: "center"
            }}>
              <button
                style={{
                  background: "#ffb6c1",
                  color: "#fff",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "24px",
                  padding: "18px 42px",
                  fontSize: "1.2rem",
                  boxShadow: "0 2px 8px #f4b9d4",
                  cursor: "pointer"
                }}
                onClick={() => {
                  setStep("loading");
                  calcResult();
                  setTimeout(() => setStep("result"), 3000);
                }}
              >
                {ko.toResult}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 결과 분석 중 */}
      {step === "loading" && (
        <div style={{
          width: "100%",
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            fontSize: "1.5rem",
            color: "#d35c7a",
            fontWeight: 700,
            marginBottom: 36
          }}>{ko.loading}</div>
          {/* 로딩 애니메이션: 점 3개 */}
          <div style={{ display: "flex", gap: 8 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 16, height: 16, borderRadius: "50%",
                background: "#ffb6c1",
                opacity: 0.7,
                animation: `bounce 1s ${i * 0.2}s infinite alternate`
              }} />
            ))}
          </div>
          <style>
            {`
              @keyframes bounce {
                0% { transform: translateY(0);}
                100% { transform: translateY(-18px);}
              }
            `}
          </style>
        </div>
      )}

      {/* 결과 화면 */}
      {step === "result" && (
        <div style={{
          width: "100%",
          marginTop: 36,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "24px",
            boxShadow: "0 2px 16px #f4b9d4",
            padding: "36px 24px",
            width: "90%",
            maxWidth: "400px",
            textAlign: "center",
            position: "relative"
          }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 8 }}>
              {result.emoji}
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#d35c7a", marginBottom: 8 }}>
              {result.title} <span style={{ fontSize: "1.1rem", color: "#888" }}>({result.nickname})</span>
            </div>
            <div style={{ margin: "12px 0", fontWeight: 700, color: "#ff6a6a" }}>
              {result.mz_comment}
            </div>
            <div style={{ fontSize: "1.1rem", color: "#a45c7a", marginBottom: 18 }}>
              {result.desc}
            </div>
            <div style={{ margin: "18px 0", fontSize: "2rem" }}>{result.meme}</div>
            <div style={{ fontSize: "1rem", color: "#6a6a6a", marginBottom: 12 }}>
              <b>나랑 케미 최고 동물:</b> {result.best_friend}
            </div>
            <div style={{ fontSize: "1rem", color: "#6a6a6a", marginBottom: 12 }}>
              <b>TMI:</b> {result.tmi}
            </div>
            <div style={{ fontSize: "1rem", color: "#6a6a6a", marginBottom: 12 }}>
              <b>오늘의 추천 밈 행동:</b> {result.recommend}
            </div>
            <div style={{
              background: "#ffe8f3",
              borderRadius: "14px",
              padding: "10px 12px",
              fontSize: "0.95rem",
              color: "#d35c7a",
              margin: "18px 0 0 0"
            }}>
              <b>공유용 밈 문구:</b><br />
              <span style={{ userSelect: "all" }}>{result.share_phrase}</span>
              <button
                style={{
                  marginLeft: 8,
                  background: "#ffb6c1",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "4px 10px",
                  fontSize: "0.95rem",
                  cursor: "pointer"
                }}
                onClick={() => handleCopyMeme(result.share_phrase)}
              >
                {ko.copyMeme}
              </button>
              {copied && (
                <span style={{
                  marginLeft: 10,
                  color: "#ff6a6a",
                  fontWeight: 700,
                  fontSize: "0.95rem"
                }}>복사됨!</span>
              )}
            </div>
            <div style={{
              margin: "20px 0 0 0",
              fontSize: "1.05rem",
              color: "#a45c7a",
              fontStyle: "italic"
            }}>
              {result.mz_dialog}
            </div>
          </div>
          {/* 공유 버튼 */}
          <div style={{ marginTop: 32, display: "flex", gap: "18px" }}>
            <button
              style={{
                background: "#f3e7e9",
                color: "#d35c7a",
                border: "none",
                borderRadius: "18px",
                padding: "14px 24px",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px #f4b9d4"
              }}
              onClick={handleCopyResultUrl}
            >
              {ko.shareResult}
            </button>
            <button
              style={{
                background: "#ffe8f3",
                color: "#a45c7a",
                border: "none",
                borderRadius: "18px",
                padding: "14px 24px",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px #f4b9d4"
              }}
              onClick={handleCopyAppUrl}
            >
              {ko.shareApp}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

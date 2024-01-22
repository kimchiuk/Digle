const webpack = require("webpack");

module.exports = {
  // 프로젝트의 진입점 설정
  entry: "./src/index.js", // 여기서는 src/index.js를 예시로 사용합니다.

  // 번들링된 파일의 출력 설정
  output: {
    path: __dirname + "/dist", // 번들 파일을 dist 디렉터리에 저장합니다.
    filename: "bundle.js", // 번들 파일의 이름을 bundle.js로 설정합니다.
  },

  // 모듈 처리 방법 정의
  module: {
    rules: [
      // janus.js를 처리하기 위한 exports-loader 설정
      {
        test: require.resolve("janus-gateway"),
        loader: "exports-loader",
        options: {
          exports: "Janus",
        },
      },
      // 추가적인 로더 설정 (예: Babel 로더 등)은 여기에 포함될 수 있습니다.
    ],
  },

  // 플러그인 설정
  plugins: [
    // webrtc-adapter를 전역 변수로 제공
    new webpack.ProvidePlugin({
      adapter: ["webrtc-adapter", "default"],
    }),
  ],
};

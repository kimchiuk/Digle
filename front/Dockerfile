# Node.js 이미지를 기반으로 설정
FROM node:14

# 애플리케이션 디렉토리 생성
WORKDIR .

# 애플리케이션 의존성 설치
COPY package*.json ./
RUN npm install

# 애플리케이션 소스 추가
COPY . .

# ARG 및 ENV 설정 추가
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# React 앱 빌드
RUN npm run build

# 애플리케이션이 사용할 포트 설정
EXPOSE 3000

# 애플리케이션 실행
CMD ["npm", "start"]
pipeline {
    agent any

    environment {
        // 환경 변수 설정
        DOCKER_REGISTRY_CREDENTIALS = credentials('bogeun_docker') // 도커 레지스트리 크레덴셜 ID
        IMAGE_NAME = 'S10P12D107'
        
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    git credentialsId: 'bogeun kim', url: 'https://lab.ssafy.com/s10-webmobile1-sub2/S10P12D107.git'
                }
            }
         }

         stage('Build Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', DOCKER_REGISTRY_CREDENTIALS) {
                        def customImage = docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}")
                }
            }
         }

         stage('Push to Docker Registry') {
            steps {
                script {
                    // 도커 이미지를 레지스트리에 푸시
                    docker.withRegistry('https://registry.hub.docker.com', DOCKER_REGISTRY_CREDENTIALS) {
                        customImage.push()
                    }
                }
            }
        }      
        

         stage('run backend') {
            steps {
              dir('./back') {
                sh 'uvicorn app.main:app --reload'
              }
            }
         }

         stage('run frontend') {
            steps {
                dir('./front') {
                    sh 'npm start'
                }
            }
         }
    }

    }
        
}
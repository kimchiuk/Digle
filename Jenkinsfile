pipeline {
    agent any

    environment {
        // 환경 변수 설정
        DOCKER_REGISTRY_CREDENTIALS = credentials('docker') // 도커 레지스트리 크레덴셜 ID
        IMAGE_NAME = 'digle'
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    git credentialsId: 'gitlab', url: 'https://lab.ssafy.com/s10-webmobile1-sub2/S10P12D107.git'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {

                     sh 'echo $PATH'  // $PATH 출력
            sh 'which docker'  // Docker 실행 파일 위치 출력
                    withDockerRegistry(credentialsId: 'docker', url: 'https://registry.hub.docker.com') {
                        def customImage = docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}")
                    }
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
        
        stage('Run Backend') {
            steps {
                dir('./back') {
                    sh 'uvicorn app.main:app --reload'
                }
            }
        }

        stage('Run Frontend') {
            steps {
                dir('./front') {
                    sh 'npm start'
                }
            }
        }
    }
}

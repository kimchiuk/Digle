def backendImage
def frontendImage

pipeline {
    agent any

    environment {
        // 환경 변수 설정
        GIT_REGISTRY_CREDENTIALS = credentials('gitlab')
        DOCKER_REGISTRY_CREDENTIALS = credentials('docker')
        BACK_IMAGE_NAME = 'geunbo/digle'
        FRONT_IMAGE_NAME = 'geunbo/digle_front'

        DATABASE_URL = "${env.DATABASE_URL}"
        HTTPS = "${env.HTTPS}"
        NAVER_CLIENT_ID = "${env.NAVER_CLIENT_ID}"
        NAVER_CLIENT_SECRET = "${env.NAVER_CLIENT_SECRET}"
        SMTP_PASSWORD = "${env.SMTP_PASSWORD}"
        SMTP_PORT = "${env.SMTP_PORT}"
        SMTP_SERVER = "${env.SMTP_SERVER}"
        SMTP_USERNAME = "${env.SMTP_USERNAME}"
        SSL_CRT_FILE = "${env.SSL_CRT_FILE}"
        SSL_KEY_FILE = "${env.SSL_KEY_FILE}"
        DOCKER_COMPOSE_FILE = "docker-compose.yml"
        
    }
    
    stages {
        
        stage('Checkout') {
            steps {
                script {
                    git credentialsId: 'gitlab', url: 'https://lab.ssafy.com/s10-webmobile1-sub2/S10P12D107.git'
                }
            }
        }

        stage('Build and Push the Back-end Docker Image') {
            steps {
                script {
                    sh 'echo "Starting Build Back Docker Image"'
                    dir('back') {
                        withDockerRegistry(credentialsId: 'docker', url: 'https://registry.hub.docker.com') {
                            
                             backendImage = docker.build("${BACK_IMAGE_NAME}:${env.BUILD_NUMBER}", 
                                "--build-arg DATABASE_URL=${env.DATABASE_URL} " +
                                "--build-arg HTTPS=${env.HTTPS} " +
                                "--build-arg NAVER_CLIENT_ID=${env.NAVER_CLIENT_ID} " +
                                "--build-arg NAVER_CLIENT_SECRET=${env.NAVER_CLIENT_SECRET} " +
                                "--build-arg SMTP_PASSWORD=${env.SMTP_PASSWORD} " +
                                "--build-arg SMTP_PORT=${env.SMTP_PORT} " +
                                "--build-arg SMTP_SERVER=${env.SMTP_SERVER} " +
                                "--build-arg SMTP_USERNAME=${env.SMTP_USERNAME} " +
                                "--build-arg SSL_CRT_FILE=${env.SSL_CRT_FILE} " +
                                "--build-arg SSL_KEY_FILE=${env.SSL_KEY_FILE} .")
                            // Docker 빌드 결과 출력
                            if (backendImage != 0) {
                                echo "Docker build succeeded: ${BACK_IMAGE_NAME}:${env.BUILD_NUMBER}"
                                docker.withRegistry('https://registry.hub.docker.com', 'docker') {
                                    backendImage.push()
                            }
                            } else {
                                error "Docker build failed"
                            }
                        }
                    }
                }
            }
            
        }    
        stage('Build and Push the Front-end Docker Image') {
            steps {
                script {
                    sh 'echo "Starting Build Front Docker Image"'
                    dir('front') {
                        withDockerRegistry(credentialsId: 'docker', url: 'https://registry.hub.docker.com') {
                            
                             frontendImage = docker.build("${FRONT_IMAGE_NAME}:${env.BUILD_NUMBER}")
                            // Docker 빌드 결과 출력
                            if (frontendImage != 0) {
                                echo "Docker build succeeded: ${FRONT_IMAGE_NAME}:${env.BUILD_NUMBER}"
                                docker.withRegistry('https://registry.hub.docker.com', 'docker') {
                                    frontendImage.push()
                            }
                            } else {
                                error "Docker build failed"
                            }
                        }
                    }
                }
            }
            
        }    
        stage('Deploy') {
            steps {
                script {
                    sh "docker-compose -f ${DOCKER_COMPOSE_FILE} pull"
                    sh "docker-compose -f ${DOCKER_COMPOSE_FILE} up -d"
                }
            }
        }
    }
}

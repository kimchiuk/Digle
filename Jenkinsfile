def customImage
def jenkinsInstance = Jenkins.getInstance()
def systemProperties = jenkinsInstance.systemProperties

pipeline {
    agent any

    environment {
        // 환경 변수 설정
        GIT_REGISTRY_CREDENTIALS = credentials('gitlab')
        DOCKER_REGISTRY_CREDENTIALS = credentials('docker')
        IMAGE_NAME = 'geunbo/digle'


        // DATABASE_URL = "${systemProperties['DATABASE_URL']}"
        // HTTPS = "${systemProperties['HTTPS']}"
        // NAVER_CLIENT_ID = "${systemProperties['NAVER_CLIENT_ID']}"
        // NAVER_CLIENT_SECRET = "${systemProperties['NAVER_CLIENT_SECRET']}"
        // SMTP_PASSWORD = "${systemProperties['SMTP_PASSWORD']}"
        // SMTP_PORT = "${systemProperties['SMTP_PORT']}"
        // SMTP_SERVER = "${systemProperties['SMTP_SERVER']}"
        // SMTP_USERNAME = "${systemProperties['SMTP_USERNAME']}"
        // SSL_CRT_FILE = "${systemProperties['SSL_CRT_FILE']}"
        // SSL_KEY_FILE = "${systemProperties['SSL_KEY_FILE']}"

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
                             customImage = docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}", "--build-arg MY_ENV_VAR=${env.DATABASE_URL} .")
                            // Docker 빌드 결과 출력
                            if (customImage != 0) {
                                echo "Docker build succeeded: ${IMAGE_NAME}:${env.BUILD_NUMBER}"
                                docker.withRegistry('https://registry.hub.docker.com', 'docker') {
                                    customImage.push()
                            }
                            } else {
                                error "Docker build failed"
                            }
                        }
                    }
                }
            }
            
        }    
        
        stage('Run Backend') {
            steps {
                dir('back') {
                    script {
                        sh "docker run -p 8000:8000 ${IMAGE_NAME}:${env.BUILD_NUMBER}"
                    }
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

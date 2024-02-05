def customImage
// def jenkinsInstance = Jenkins.getInstance()
// def systemProperties = jenkinsInstance.systemProperties

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
        // SSL_CRT_FILE = "${env.SSL_CRT_FILE}"
        // SSL_KEY_FILE = "${env.SSL_KEY_FILE}"

        
    }
    
    stages {
        
        stage('Checkout') {
            steps {
                script {
                    git credentialsId: 'gitlab', url: 'https://lab.ssafy.com/s10-webmobile1-sub2/S10P12D107.git'
                }
            }
        }

        // stage('Build and Push the Back-end Docker Image') {
        //     steps {
        //         script {
        //             sh 'echo "Starting Build Back Docker Image"'
        //             echo "DEBUG: DATABASE_URL=${env.DATABASE_URL}"
        //             dir('back') {
        //                 withDockerRegistry(credentialsId: 'docker', url: 'https://registry.hub.docker.com') {
                            
        //                      customImage = docker.build("${BACK_IMAGE_NAME}:${env.BUILD_NUMBER}", 
        //                         "--build-arg DATABASE_URL=${env.DATABASE_URL} " +
        //                         "--build-arg HTTPS=${env.HTTPS} " +
        //                         "--build-arg NAVER_CLIENT_ID=${env.NAVER_CLIENT_ID} " +
        //                         "--build-arg NAVER_CLIENT_SECRET=${env.NAVER_CLIENT_SECRET} " +
        //                         "--build-arg SMTP_PASSWORD=${env.SMTP_PASSWORD} " +
        //                         "--build-arg SMTP_PORT=${env.SMTP_PORT} " +
        //                         "--build-arg SMTP_SERVER=${env.SMTP_SERVER} " +
        //                         "--build-arg SMTP_USERNAME=${env.SMTP_USERNAME} " +
        //                         "--build-arg SSL_CRT_FILE=${env.SSL_CRT_FILE} " +
        //                         "--build-arg SSL_KEY_FILE=${env.SSL_KEY_FILE} .")
        //                     // Docker 빌드 결과 출력
        //                     if (customImage != 0) {
        //                         echo "Docker build succeeded: ${BACK_IMAGE_NAME}:${env.BUILD_NUMBER}"
        //                         docker.withRegistry('https://registry.hub.docker.com', 'docker') {
        //                             customImage.push()
        //                     }
        //                     } else {
        //                         error "Docker build failed"
        //                     }
        //                 }
        //             }
        //         }
        //     }
            
        // }    
        stage('Build and Push the Front-end Docker Image') {
            steps {
                script {
                    sh 'echo "Starting Build Front Docker Image"'
                    dir('front') {
                        withDockerRegistry(credentialsId: 'docker', url: 'https://registry.hub.docker.com') {
                            
                             customImage = docker.build("${FRONT_IMAGE_NAME}:${env.BUILD_NUMBER}")
                            // Docker 빌드 결과 출력
                            if (customImage != 0) {
                                echo "Docker build succeeded: ${FRONT_IMAGE_NAME}:${env.BUILD_NUMBER}"
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
        
        // stage('Run Backend') {
        //     steps {
        //         dir('back') {
        //             script {
        //                 sh "docker run -p 8000:8000 ${BACK_IMAGE_NAME}:${env.BUILD_NUMBER}"
        //             }
        //         }
        //     }
        // }

        stage('Run Frontend') {
            steps {
                dir('front') {
                    // sh "docker run -p 3000:3000 ${FRONT_IMAGE_NAME}:${env.BUILD_NUMBER}"
                }
            }
        }
    }
}

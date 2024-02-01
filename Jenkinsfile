pipeline {
    agent any

    environment {
        // 환경 변수 설정
        GIT_REGISTRY_CREDENTIALS = credentials('gitlab')
        DOCKER_REGISTRY_CREDENTIALS = credentials('docker')
        // PATH = "/usr/bin:$PATH"  // Docker 바이너리 경로 추가
         PATH = "/usr/local/bin:/usr/bin:$PATH"
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

        stage('Check Docker') {
            steps {
                script {
                    def dockerCheck = sh(script: 'docker --version', returnStatus: true)
                    if (dockerCheck == 0) {
                        echo "Docker is available on the Jenkins agent."
                    } else {
                        error "Docker is not available on the Jenkins agent."
                    }
                }
            }
        }

        stage('Build Back Docker Image') {
            steps {
                script {
                    sh 'echo "Starting Build Back Docker Image"'
                   
                    dir('back') {
                        // withDockerRegistry(credentialsId: 'docker', url: 'https://registry.hub.docker.com') {
                        //      def customImage = docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}")
                        //     // Docker 빌드 결과 출력
                        //     if (customImage == 0) {
                        //         echo "Docker build succeeded: ${IMAGE_NAME}:${env.BUILD_NUMBER}"
                        //     } else {
                        //         error "Docker build failed"
                        //     }
                        // }
                        // 도커 빌드를 직접 수행
                            def customImage = docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}")

                            // Docker 빌드 결과 출력
                            if (customImage != null) {
                                echo "Docker build succeeded: ${IMAGE_NAME}:${env.BUILD_NUMBER}"
                            } else {
                                error "Docker build failed"
                            }
                    }
                }
            }
            
        }

        stage('Push to Docker Registry') {
            steps {
                script {
                    // 도커 이미지를 레지스트리에 푸시
                    withDockerRegistry(credentialsId: 'docker', url: 'https://registry.hub.docker.com') {
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

pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'chosami/webrtc'
        DOCKER_TAG = 'latest'

    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("chosami/${DOCKER_IMAGE}:${DOCKER_TAG}", './back/')
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_USERNAME}:${DOCKER_PASSWORD}") {
                            docker.image("${DOCKER_IMAGE}_back:${DOCKER_TAG}").push()
                        }
                    }
                }
            }
        }

        
    }

    post {
        always {
            echo 'CI/CD Pipeline execution completed'
        }
    }
}

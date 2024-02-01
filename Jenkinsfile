pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'chosami/webrtc'
        DOCKER_TAG = 'latest'
        REGISTRY_CREDENTIALS_ID = 'your-dockerhub-credentials-id'
        KUBE_CONFIG = 'your-kubeconfig-file-path'
        AWS_CREDENTIALS_ID = 'your-aws-credentials-id'
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
                    docker.build("chosami/webrtc_back:$DOCKER_TAG", 'back/')
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', REGISTRY_CREDENTIALS_ID) {
                        docker.image("chosami/webrtc_back:$DOCKER_TAG").push()
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

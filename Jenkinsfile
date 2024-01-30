pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    git credentialsId: 'bogeun kim', url: 'https://lab.ssafy.com/s10-webmobile1-sub2/S10P12D107.git'
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
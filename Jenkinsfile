pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    git credentialsId: 'id-pw', url: 'https://lab.ssafy.com/s10-webmobile1-sub2/S10P12D107.git', branch: 'master'
                }
            }
        }
    }
        
}
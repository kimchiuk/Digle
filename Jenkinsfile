node {

    stage('Checkout') {
            steps {
                script {
                    git credentialsId: 'id-pw', url: 'https://lab.ssafy.com/s10-webmobile1-sub2/S10P12D107.git', branch: 'back/recording/sarang'
                }
            }
        }
    stage('Test') {
        echo 'Testing....'
    }
    // stage('execute sh') {
	// 	sh "chmod 774 ./project.sh"
    //     sh "./project.sh"
    // }
}
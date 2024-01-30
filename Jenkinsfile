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
        
        stage('Install Conda') {
            steps {
                script {
                    sh 'curl -0 https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh'
                    sh 'bash miniconda.sh -b -p $HOME/miniconda'
                    sh '$HOME/miniconda/bin/conda init'
                    sh 'source ~/.bashrc'  // 또는 새로운 터미널을 열어도 됩니다.
                }
            }
        }

        stage('Create Conda Environment') {
            steps {
                script {
                    sh 'conda create --name myenv python=3.8'
                    sh 'conda activate myenv'
                }
            }
        }

        stage('Install Packages') {
            steps {
                dir('./back') {
                    sh 'pip install -r requirements.txt'
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
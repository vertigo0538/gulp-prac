pipeline {
    agent {
        docker {
            image 'node:14.15.4' 
            args '-p 3000:3000' 
        }
    }
    environment {
      CI = 'true'
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install' 
                sh 'npm run build'
            }
        }
        
    }
}
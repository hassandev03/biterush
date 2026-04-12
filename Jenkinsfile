pipeline {
    agent any
    
    triggers {
        githubPush()
    }
    
    stages {

        stage('Clone Repository') {
            steps {
                echo 'Cloning repository from GitHub...'
                git branch: 'main', url: 'https://github.com/hassandev03/biterush.git'
            }
        }

        stage('Build and Run Containers') {
            steps {
                echo 'Stopping old containers if running...'
                sh 'docker compose down || true'

                echo 'Building and starting containers...'
                sh 'docker compose up --build -d'
            }
        }

    }
}

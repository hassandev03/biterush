pipeline {
    agent any

    triggers { githubPush() }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/hassandev03/biterush.git'
            }
        }

        stage('Start App') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up --build -d'
                sleep(time: 60, unit: 'SECONDS')
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    docker run --rm \
                        --network host \
                        --entrypoint "" \
                        -v $(pwd)/tests:/app \
                        pak00329/selenium_python_chrome \
                        sh -c "pip install pytest -q && pytest /app -v --tb=short --junit-xml=/app/test-results.xml"
                '''
            }
            post {
                always { junit 'tests/test-results.xml' }
            }
        }
    }

    post {
        always {
            sh 'docker compose down || true'
            script {
                def pusherEmail = sh(script: "git log -1 --format='%ae'", returnStdout: true).trim()
                emailext(
                    to: "${pusherEmail}",
                    subject: "BiteRush Test Results — Build #${BUILD_NUMBER}: ${currentBuild.currentResult}",
                    body: """
                        Build: ${BUILD_URL}
                        Status: ${currentBuild.currentResult}
                        Triggered by: ${pusherEmail}

                        See full test report: ${BUILD_URL}testReport/
                    """,
                    attachmentsPattern: 'tests/test-results.xml'
                )
            }
        }
    }
}
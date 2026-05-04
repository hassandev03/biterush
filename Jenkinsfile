pipeline {
    agent any

    triggers { githubPush() }

    stages {

        stage('Clone App') {
            steps {
                git branch: 'main', url: 'https://github.com/hassandev03/biterush.git'
            }
        }

        stage('Clone Tests') {
            steps {
                dir('tests-repo') {
                    git branch: 'main', url: 'https://github.com/hassandev03/biterush-test.git'
                }
            }
        }

        stage('Start App') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up --build -d'
                sleep(time: 100, unit: 'SECONDS')
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    docker run --rm \
                        --network host \
                        --entrypoint "" \
                        -v $(pwd)/tests-repo:/app \
                        pak00329/selenium_python_chrome \
                        sh -c "pip install pytest -q && pytest /app -v --tb=short --junit-xml=/app/test-results.xml"
                '''
            }
            post {
                always { junit 'tests-repo/test-results.xml' }
            }
        }
    }

    post {
        always {
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
                    attachmentsPattern: 'tests-repo/test-results.xml'
                )
            }
        }
    }
}

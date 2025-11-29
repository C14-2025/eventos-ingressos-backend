pipeline {
    agent {
        docker {
            image 'node:18'
        }
    }

    triggers {
        githubPush()
    }

    environment {
        API_URL = 'http://localhost:3333'

        MYSQL_HOST = 'database'
        MYSQL_PORT = '3306'
        MYSQL_USER = 'admin'
        MYSQL_PASSWORD = '123456'
        MYSQL_DATABASE = 'database_test'

        REDIS_HOST = 'redis'
        REDIS_PORT = '6379'
        REDIS_PASSWORD = '12345'

        NODE_ENV = 'test'
        PORT = '3333'
    }

    stages {
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Start API for tests') {
            steps {
                sh 'npm run dev &'

                sh '''
                echo "Aguardando API subir..."
                for i in {1..30}; do
                    if nc -z localhost 3333; then
                        echo "API está rodando!"
                        break
                    fi
                    echo "Aguardando..."
                    sleep 2
                done
                '''
            }
        }

        stage('Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }

            post {
                success {
                    archiveArtifacts artifacts: 'dist/**', fingerprint: true
                    archiveArtifacts artifacts: 'coverage/**', fingerprint: true
                }
            }
        }

        // stage('Notify Users') {
        //     steps {
        //         sh 'node dist/modules/users/services/sendEmail.js'
        //     }
        // }
    }
}

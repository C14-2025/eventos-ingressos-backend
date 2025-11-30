pipeline {
    agent any

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
                sh 'npm run test2'
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

        stage('Deploy to EC2') {
                  steps {
                      sshagent(['ec2-ssh-key']) {
                          sh '''
                          ssh -o StrictHostKeyChecking=no ubuntu@ec2-18-222-99-213.us-east-2.compute.amazonaws.com << 'EOF'

                          cd evenetos-ingressos-backend

                          echo "🛠 Atualizando código..."
                          git pull

                          echo "📦 Instalando dependências..."
                          npm install

                          echo "🚀 Reiniciando API com PM2..."
                          pm2 stop 0 

                          echo "🏗 Buildando projeto..."
                          npm run build

                          echo "🚀 Reiniciando API com PM2..."
                          pm2 restart 0 

                          echo "✔ Deploy finalizado com sucesso!"
                          EOF
                          '''
                      }
                  }
              }
    }
}

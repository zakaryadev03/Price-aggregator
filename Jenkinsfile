pipeline {
    agent any
    tools {
        nodejs 'nodejs23'
    }
    environment{
        SCANNER_HOME = tool "sonar-scanner"
    }
    stages {
        stage('Git checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/zakaryadev03/Price-aggregator.git'
            }
        }
        
        stage('Frontend compilation') {
            steps {
                dir('src/frontendNEXT'){
                    sh 'find . -name "*.js" -exec node -c {} +'
                }
            }
        }
        
        
        stage('Gitleaks scan') {
            steps {
                sh 'gitleaks detect --source ./src/frontendNEXT --exit-code 1'
            }
        }

        stage('SonarQube analysis') {
            steps {
                withSonarQubeEnv('sonar') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=Price-Aggregator \
                            -Dsonar.projectKey=price-aggregator '''
                }
            }
        }
        
        stage('Quality gate check') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: false, credentialsId: 'sonar-token'
                }
            }
        }
        
        stage('Trivy Fs Scan') {
            steps {
                sh 'trivy fs --format table -o fs-report.html .'
            }
        }
    }
}

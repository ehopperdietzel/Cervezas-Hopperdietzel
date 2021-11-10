pipeline {
  agent none 
  stages {
    stage('Checkout, Build') {
        agent {
          docker {
            image 'composer:1.9.3'
            args '-p 3001:3000'
          }
        }
        environment {
          HOME = '.'
        }
        stages {
          stage('Install') {
            steps {
                sh 'apt-get update'
                sh 'apt install nodejs'
                sh 'apt install npm'
                sh 'npm install -g @angular/cli'
                dir('code') {
                    sh 'composer install'
                    dir('angular') {
                        sh 'npm install'
                    }
                }
            }
          }
          stage('Build') {
            steps {
                dir('code') {
                    sh 'php artisan migrate'
                    dir('angular') {
                        sh 'ng build'
                        sh 'mv ../public/hopperdietzel/* ../public/'
                    }
                }
            }
          }
          stage('Archive') {
            steps {
              archiveArtifacts 'build/**'
            }
          }
        }
    }
    stage('Deploy') {
      agent {
        label 'master'
      }
      options {
        skipDefaultCheckout()
      }
      steps {
        sh 'rm -rf /var/www/hopperdietzel'
        sh 'mkdir /var/www/hopperdietzel'
        sh 'cp -Rp build/** /var/www/hopperdietzel'
        sh 'docker stop hopperdietzel || true && docker rm hopperdietzel || true'
        sh 'docker run -dit --name hopperdietzel -p 8004:80 -v /var/www/hopperdietzel/:/usr/local/apache2/htdocs/ httpd:2.4'
      }
    }
  }
}
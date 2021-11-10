pipeline {
  agent none 
  stages {
    stage('Checkout, Build') {
        agent {
          docker {
            image 'bitnami/laravel:latest'
            args '-p 3001:3000'
          }
        }
        environment {
          HOME = '.'
        }
        stages {
          stage('Install') {
            steps {
                dir('code') {
                    sh 'composer install'
                }
            }
          }
          stage('Build') {
            steps {
                dir('code') {
                    sh 'php artisan migrate'
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
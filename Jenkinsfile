pipeline {
  agent none 
  stages {
    stage('Checkout, Build') {
        agent {
          docker {
            image 'ubuntu:xenial'
            args '-p 3001:3000'
          }
        }
        environment {
          HOME = '.'
        }
        stages {
          stage('Install') {
            steps {
                sh 'sudo apt-get update'
                sh 'sudo apt update && sudo apt install wget php-cli php-zip unzip curl'
                sh 'sudo curl -sS https://getcomposer.org/installer |php'
                sh 'sudo mv composer.phar /usr/local/bin/composer'
                sh 'sudo apt install nodejs'
                sh 'sudo apt install npm'
                sh 'sudo npm install -g @angular/cli'
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
                        sh 'mv -f ../public/hopperdietzel/* ../public/'
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
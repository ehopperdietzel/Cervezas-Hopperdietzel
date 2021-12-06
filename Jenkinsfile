pipeline {
  agent none 
  stages {

    stage('Database') {
      agent {
        docker { 
          image 'mysql:8.0'
          args '-p 7500:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=hopperdietzel -e MYSQL_USER=prueba -e MYSQL_PASSWORD=prueba'
        }
      }
      steps {
        sh "echo 'MySQL started.'"
      }
    }

    stage('Laravel') {
      agent {
        docker {
          image 'bitnami/laravel:latest'
        }
      }
      environment {
        HOME = '.'
      }
      stages {
        stage('Install') {
          steps {
            dir('code/laravel') {
                sh 'composer install'
            }
          }
        }
        stage('Build') {
          steps {
            dir('code/laravel') {
              sh 'mv .env.production .env'
              sh 'php artisan migrate:fresh'
            }
          }
        }
        stage('Archive') {
          steps {
            archiveArtifacts 'code/**'
          }
        }
      }
    }

    stage('Angular') {
      agent {
        docker { 
          image 'trion/ng-cli:latest'
        }
      }
      environment {
        HOME = '.'
      }
      stages {
        stage('Install') {
          steps {
            dir('code/angular') {
                sh 'npm install'
            }
          }
        }
        stage('Build') {
          steps {
            dir('code/angular') {
              sh 'ng build'
            }
            dir('code/laravel') {
              sh 'cp -R public/hopperdietzel/* public/'
            }
          }
        }
        stage('Archive') {
          steps {
            archiveArtifacts 'code/laravel/**'
          }
        }
      }
    }
    
    stage('Apache') {
      agent {
        label 'master'
      }
      options {
        skipDefaultCheckout()
      }
      steps {
        sh 'rm -rf /var/www/hopperdietzel'
        sh 'mkdir /var/www/hopperdietzel'
        sh 'cp -Rp code/laravel/** /var/www/hopperdietzel'
        sh 'docker stop hopperdietzel || true && docker rm hopperdietzel || true'
        sh 'docker run -dit --name hopperdietzel -p 8004:80 -p 7500:8889 -v /var/www/hopperdietzel/:/var/www/html/ -e APACHE_DOCUMENT_ROOT=/var/www/html/public php:7.1-apache'
      }
    }
  }
}
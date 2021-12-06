pipeline {
  agent none 
  stages {

    stage('MySQL') {
      agent {
        label 'master'
      }
      options {
        skipDefaultCheckout()
      }
      steps {
        sh 'docker network create hopper-net || true'
        sh 'docker stop hopper-mysql || true && docker rm hopper-mysql || true'
        sh 'docker run -d --name hopper-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=hopperdietzel -e MYSQL_USER=prueba -e MYSQL_PASSWORD=prueba mysql:8.0'
      }
    }

    stage('Laravel') {
      agent {
        docker {
          image 'bitnami/laravel:latest'
          args '--net hopper-net'
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
        sh 'docker run -dit --name hopperdietzel -p 8004:80 --net hopper-net -v /var/www/hopperdietzel/:/var/www/html/public/ -e APACHE_DOCUMENT_ROOT="/var/www/html/public/public" php:7.2-apache'
        sh 'docker exec -it hopperdietzel php /var/www/html/public/artisan migrate:fresh'
      }
    }
  }
}
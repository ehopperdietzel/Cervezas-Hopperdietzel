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
        sh 'docker run -d --net hopper-net --name hopper-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=hopperdietzel -e MYSQL_USER=prueba -e MYSQL_PASSWORD=prueba mysql:8.0'
        sh 'docker ps'
        sh 'docker network ls'
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
              sh 'php artisan migrate:fresh || true'
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
              sh 'rm -rf public/hopperdietzel/'
            }
            sh 'rm -rf code/angular/'
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
        sh 'cp -Rp ./** /var/www/hopperdietzel'
        sh 'docker stop hopperdietzel || true && docker rm hopperdietzel || true'
        dir('/var/www/hopperdietzel') {
          sh 'docker build -t hopper-app .'
          sh 'docker run -d --name hopperdietzel -p 8004:80 --net hopper-net hopper-app'
        }
      }
    }
  }
}
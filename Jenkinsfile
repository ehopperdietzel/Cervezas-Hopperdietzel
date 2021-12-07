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
    
    stage('Laravel') {
      agent {
        label 'master'
      }
      options {
        skipDefaultCheckout()
      }
      steps {
        sh 'rm -rf /var/www/hopperdietzel'
        sh 'mkdir /var/www/hopperdietzel'
        sh 'cp -Rp ./code/laravel/** /var/www/hopperdietzel'
        sh 'docker stop hopperdietzel || true && docker rm hopperdietzel || true'
        sh 'docker run -dit --name hopperdietzel -v /var/www/hopperdietzel/:/home/bitnami/ -p 8004:8000 --net hopper-net bitnami/laravel:latest'
        sh 'docker exec hopperdietzel sh -c "cd /home/bitnami/ && composer install"'
        sh 'docker exec hopperdietzel sh -c "mv /home/bitnami/.env.production /home/bitnami/.env"'
        sh 'docker exec hopperdietzel sh -c "cd /home/bitnami && php artisan migrate:fresh --no-interaction --force"'
        sh 'docker exec hopperdietzel sh -c "cd /home/bitnami && php artisan serve"'
      }
    }
  }
}
#FROM php:7.4-apache

#ENV APACHE_DOCUMENT_ROOT /var/www/html/code/laravel/public

#RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
#RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

FROM bitnami/laravel:latest

COPY ./code/laravel/ /home/bitnami
RUN cd /home/bitnami && composer install
RUN mv /home/bitnami/.env.production /home/bitnami/.env

ENTRYPOINT cd /home/bitnami && php artisan migrate:fresh --no-interaction --force && php artisan serve --port=8000

FROM httpd:2.4
COPY ./code/laravel/ /usr/local/apache2/htdocs/
COPY ./code/laravel/httpd.conf /usr/local/apache2/conf/httpd.conf
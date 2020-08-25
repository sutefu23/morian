FROM wordpress:latest
RUN apt-get update
RUN apt-get -y install unzip

RUN curl --location --output /usr/local/bin/mhsendmail https://github.com/mailhog/mhsendmail/releases/download/v0.2.0/mhsendmail_linux_amd64 && \
    chmod +x /usr/local/bin/mhsendmail
RUN echo 'sendmail_path="/usr/local/bin/mhsendmail --smtp-addr=mailhog:1025 --from=admin@example.com"' > /usr/local/etc/php/conf.d/mailhog.ini

RUN rm -rf /var/www/html/*
ADD $HTML_DIR /var/www/html/
RUN chown -R www-data:www-data /var/www/html/cms/wp-content

ENV HOST 0.0.0.0


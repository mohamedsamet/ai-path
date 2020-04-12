FROM node:10

#**************** INSTALL GOOGLE CHROME ***************/
# Install wget.
RUN apt-get install -y wget
# Set the Chrome repo.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
# Install Chrome.npm insta
RUN apt-get update && apt-get -y install google-chrome-stable

# **************** UNINSTALL GIT *****************/
RUN sh -c '/bin/echo -e "yes\n" | apt-get remove git' 

#****************************#
ENV LANG en_US.UTF-8

# **************** INSTALL GLOBAL ***************/
RUN npm install -g gulp 
RUN npm install -g @angular/cli@9.1.1
#RUN apt-get install net-tools

# **************** SELECT WORKDIR ***************/
WORKDIR /home/ai-path

# # **************** ADD package.json file ***************/
ADD package.json package.json

# # **************** INSTALL PACKAGES ***************/
RUN npm install
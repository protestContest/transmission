#!/bin/sh

curl -sL https://deb.nodesource.com/setup | sudo bash -
apt-get -y install vim zsh git build-essential redis-server redis-tools mongodb nodejs
npm install -g express-generator mocha gulp bower

update-alternatives --set editor /usr/bin/vim.basic

su vagrant -c "curl -L http://install.ohmyz.sh | sh"
chsh vagrant -s /usr/bin/zsh
sed -i 's/robbyrussell/terminalparty/g' /home/vagrant/.zshrc
echo "export DEBUG=app" >> /home/vagrant/.zshrc
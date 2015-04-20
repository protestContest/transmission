Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  # config.vm.provision "shell", path: "provision.sh"
  config.ssh.forward_agent = true
end

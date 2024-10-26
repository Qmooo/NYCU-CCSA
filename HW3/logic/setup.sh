sudo apt -y update
sudo apt -y install python3-pip docker.io

echo 'export MONGO_HOST=localhost' >> ~/.bashrc
echo 'export MONGO_PORT=27017' >> ~/.bashrc
echo 'export MONGO_USERNAME=admin' >> ~/.bashrc
echo 'export MONGO_PASSWORD=password' >> ~/.bashrc
source ~/.bashrc

sudo docker run --name mongodb -v ~/mongo:/data/db -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo
sleep 5

sudo cp -r /vagrant ~/backend
cd backend

pip install -r requirements.txt

# python3 app.py

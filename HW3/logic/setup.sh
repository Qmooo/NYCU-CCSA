sudo apt -y update
sudo apt -y install python3-pip docker.io

sudo docker run --name mongodb -v ~/mongo:/data/db -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo
sleep 5

export MONGO_HOST="localhost"
export MONGO_PORT="27017"
export MONGO_USERNAME="admin"
export MONGO_PASSWORD="password"

sudo cp -r /vagrant ~/backend
cd backend

pip install -r requirements.txt
# python3 app.py

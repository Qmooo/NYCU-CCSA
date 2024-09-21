from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os

app = Flask(__name__)
CORS(app)

mongo_host = os.environ.get('MONGO_HOST', 'mongodb')
mongo_port = os.environ.get('MONGO_PORT', '27017')
mongo_username = os.environ.get('MONGO_USERNAME', 'admin')
mongo_password = os.environ.get('MONGO_PASSWORD', 'password')
# 连接到 MongoDB
client = MongoClient(
    host = mongo_host,
    port = int(mongo_port),
    username = mongo_username,
    password = mongo_password
)  # 根据您的 MongoDB 设置调整 URL
db = client['appointment_db']  # 替换为您的数据库名称
appointments_collection = db['appointments']

@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    appointments = list(appointments_collection.find())
    # 将 ObjectId 转换为字符串
    for appointment in appointments:
        appointment['_id'] = str(appointment['_id'])
    return jsonify(appointments), 200

@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    data = request.json
    result = appointments_collection.insert_one(data)
    return jsonify({"message": "预约已创建"}), 201

@app.route('/api/appointments/<appointment_id>', methods=['DELETE'])
def cancel_appointment(appointment_id):
    result = appointments_collection.delete_one({"_id": ObjectId(appointment_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "预约已取消"}), 200
    return jsonify({"message": "未找到预约"}), 404

@app.route('/api/appointments/search', methods=['GET'])
def search_appointments():
    name = request.args.get('name')
    query = {}

    query['name'] = {'$regex': name, '$options': 'i'}
    # print(query)

    appointments = list(appointments_collection.find(query))
    for appointment in appointments:
        appointment['_id'] = str(appointment['_id'])
    return jsonify(appointments), 200

@app.route('/api/appointments/<appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    data = request.json
    result = appointments_collection.update_one(
        {"_id": ObjectId(appointment_id)},
        {"$set": {
            "name": data['name'],
            "date": data['date'],
            "time": data['time'],
            "service": data['service']
        }}
    )
    if result.modified_count > 0:
        return jsonify({"message": "预约已更新"}), 200
    return jsonify({"message": "未找到预约或无需更新"}), 404

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5001)

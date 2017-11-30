from pymongo import MongoClient

port_num = input('Port number: ')
client = MongoClient('127.0.0.1', port_num)
db = client['meteor']
tasks = db['realTasks']

for i in range(1, 101):
    tasks.find_one_and_update(
        {'pairNum': str(i)},
        {'$set': {'results': []}}
    )

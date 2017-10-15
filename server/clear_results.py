from pymongo import MongoClient

client = MongoClient('127.0.0.1', 3001)
db = client['meteor']
tasks = db['realTasks']

for i in range(1, 101):
    tasks.find_one_and_update(
        {'pairNum': str(i)},
        {'$set': {'results': []}}
    )

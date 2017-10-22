from pymongo import MongoClient

client = MongoClient('127.0.0.1', 3001)
db = client['meteor']
data = db['testData']

f = open('test_data.csv', 'r')

data.delete_many({})
for line in f:
    agents = line.rstrip().strip('[]').split(', ')
    pair = agents[0]
    reports = agents[1:]
    data.insert_one({"pairNum":pair,
                    "reports":reports})

f.close()

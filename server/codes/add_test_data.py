from pymongo import MongoClient

client = MongoClient('127.0.0.1', 3001)
db = client['meteor']
candy = db['candyTestData']
image = db['imageTestData']

a = open('candy_test_data.csv', 'r')
b = open('image_test_data.csv', 'r')

candy.delete_many({})
image.delete_many({})
for line in a:
    agents = line.rstrip().strip('[]').split(', ')
    pair = agents[0]
    truth = agents[1]
    reports = agents[2:-2]
    pay_0 = agents[-2]
    pay_1 = agents[-1]
    candy.insert_one({"pairNum": pair,
                        "truth": truth,
                        "reports": reports,
                        "pay_0": pay_0,
                        "pay_1": pay_1})
a.close()

for line in b:
    agents = line.rstrip().strip('[]').split(', ')
    pair = agents[0]
    truth = agents[1]
    reports = agents[2:-2]
    pay_0 = agents[-2]
    pay_1 = agents[-1]
    image.insert_one({"pairNum": pair,
                        "truth": truth,
                        "reports": reports,
                        "pay_0": pay_0,
                        "pay_1": pay_1})
b.close()

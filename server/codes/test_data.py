##fetch time information
import numpy as np

#read priors from somewhere
P0 = 0.7
P1 = 1 - P0

#simulating the traing data table

#simulate the tasks
T = 101 #number of test samples
test_data = []

for t in range(1,T):
	if np.random.uniform(0,1) <= P0:
		test_data.append(0)
	else:
		test_data.append(1)

#simulate agents
N = 100
err_rate = []

for n in range(1,N):
	err_1 = np.random.uniform(0,1)*0.4
	err_0 = np.random.uniform(0,1)*0.4
	err_rate.append([err_0,err_1])

data_train = []

for t in range(1,T):
	data_t = []
	data_t.append(t) #task id
	data_t.append(test_data[t-1])
	for n in range(1,N):
		err_rate_n = err_rate[n-1]
		if test_data[t-1] == 0:
			if np.random.uniform(0,1) <= err_rate_n[0]: #have an error in 0 -> 1
				data_t.append(1)
			else:
				data_t.append(0) #no error made on 
		else: #true label is 1
			if np.random.uniform(0,1) <= err_rate_n[1]: #have an error in 1 -> 0
				data_t.append(0)
			else:
				data_t.append(1) #no error made on 
	
	data_train.append(data_t)	


f_r = open('test_data.csv','w')
for t in range(1,T):
	#np.savetxt('test_data.csv',data_train[t-1],delimiter=',')
	#np.savetxt('test_data.csv','\n')
	f_r.write(str(data_train[t-1]))
	f_r.write('\n')

f_r.close()

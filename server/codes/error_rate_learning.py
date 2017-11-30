##fetch time information
import numpy as np

#read priors from somewhere
#P0 = 0.6
#P1 = 1 - P0
def error_rate(P0,filename):

	P1 = 1-P0
	f_r = open(filename,'r')
	cnt = 0
	#task id, label 1, label 2, label 3
	#each task is assigned to three agents; if not, we will simply skip this line of data
	p1 = []
	p2 = []
	p3 = []

	for line in f_r:
		cnt = cnt+1
		if cnt>1: #first line is description
			line = line.rstrip()
			line = line.strip("[]")
			line = line.split(',')
			ll = len(line) - 1 #number of agents
			#randomly chose three
			agent_list = np.random.choice(range(1,ll),3)
			p1.append(float(line[agent_list[0]+1]))
			if float(line[agent_list[0]+1]) == float(line[agent_list[1]+1]):
				p2.append(1)
				if (float(line[agent_list[0]+1]) == float(line[agent_list[2]+1])) & (float(line[agent_list[2]+1]) == 1):
					p3.append(1)
			else:
				p2.append(0)


	f_r.close()


	rho = P0/P1
	P0_norm = (1-np.mean(p1))/P1
	q_norm = np.mean(p2)/P1
	q3 = np.mean(p3)

	a = 2*rho**2+2*rho
	b = -4*rho**2-4*rho+4*rho*P0_norm
	c = (rho+1-P0_norm)**2+(P0_norm-rho)**2+rho-q_norm

	#initialization
	p0_est = 0.5
	p1_est = 0.5
	p0_est1 = 0.5
	p1_est1 = 0.5
	p0_est2 = 0.5
	p1_est2 = 0.5

	if b**2-4*a*c >= 0:
		p0_est1 = (-b-(b**2-4*a*c)**0.5)/(2*a)
		p1_est1 = P0_norm - rho*(1-p0_est1)
		p0_est2 = (-b+(b**2-4*a*c)**0.5)/(2*a)
		p1_est2 = P0_norm - rho*(1-p0_est2)



	err_root1 = np.abs(P0*(p0_est1)**3+P1*(1-p1_est1)**3-q3)
	err_root2 = np.abs(P0*(p0_est2)**3+P1*(1-p1_est2)**3-q3)

	if err_root1 <= err_root2:
		p0_est = p0_est1
		p1_est = p1_est1
	else:
		p0_est = p0_est2
		p1_est = p1_est2
	return p0_est,p1_est



#inputs for computing payment: answer, reference answer(randomly selected), error rates p0,p1, priors P0,

#this implements the 1/prior scoring function
def payment(ans,ref_ans,p0_est,p1_est,P0):

	P1 = 1-P0
	if p0_est+p1_est == 1: #uninformative signal, pay nothing
		pay = 0
	else: 
		if ans == 0:
			if ref_ans == 0:
				pay = (1-p1_est)/(P0*(1-p0_est-p1_est))
			else:
				pay = -1*p1_est/(P0*(1-p0_est-p1_est))

		else:
			if ref_ans == 0:
				pay = -1*p0_est/(P1*(1-p0_est-p1_est))
			else:
				pay = (1-p0_est)/(P1*(1-p0_est-p1_est))

	#re-normalization
	#bias for shifting the payment to non-negative.
	bias = min([(1-p1_est)/(P0*(1-p0_est-p1_est)),-1*p1_est/(P0*(1-p0_est-p1_est)),-1*p0_est/(P1*(1-p0_est-p1_est)),(1-p0_est)/(P1*(1-p0_est-p1_est))])
	
	pay = pay - bias
	return pay

def payment_PTS(ans,refs,ref_ans):
    #implementing peer truth serum
    k = len(refs)
    #the first ref answer is to compare, the rest is to compute the priors
    refs = np.array(refs)

    p0 = (refs==0).sum()/k
    p1 = (refs==1).sum()/k
    if ans == 0:
            if ref_ans == 0:
                    pay = 1/p0
            else:
                    pay = 0
    else:
            if ref_ans == 1:
                    pay = 1/p1
            else:
                    pay = 0

    scale = max(1/p0,1/p1)
    pay = 10*pay/scale
    return pay

def write_candy_pays():
    a = []
    with open('candy_test_data.csv', 'r') as f:
        for line in f:
            a.append(line)
    f.close()

    g = open('candy_error_rates.txt', 'r')
    cp0_err = 0
    cp1_err = 0
    for line in g:
        cp0_err = float(line.split(',')[0])
        cp1_err = float(line.split(',')[1])
    g.close()

    with open('candy_test_data.csv', 'w') as f:
        for line in a:
            pays_0 = []
            pays_1 = []
            refs = line.rstrip().strip('[]').split(', ')[2:]
            for i in range(20):
                ref_ans = refs[np.random.randint(0, len(refs))]
                pays_0.append(payment(0,int(ref_ans), cp0_err, cp1_err, 0.6))
                pays_1.append(payment(1,int(ref_ans), cp0_err, cp1_err, 0.6))
            pay_0 = np.mean(pays_0)
            pay_1 = np.mean(pays_1)
            f.write(line.rstrip().strip(']')+', '+str(pay_0)+', '+str(pay_1)+']\n')

    f.close()

def write_candy_pays_pts():
    a = []
    with open('candy_test_data_pts.csv', 'r') as f:
        for line in f:
            a.append(line)
    f.close()

    with open('candy_test_data_pts.csv', 'w') as f:
        for line in a:
            pays_0 = []
            pays_1 = []
            refs = list(map(int, line.rstrip().strip('[]').split(', ')[2:]))
            print(line)
            print(refs)
            for i in range(20):
                ref_ans = refs[np.random.randint(0, len(refs))]
                pays_0.append(payment_PTS(0, refs, ref_ans))
                pays_1.append(payment_PTS(1, refs, ref_ans))
            pay_0 = np.mean(pays_0)
            pay_1 = np.mean(pays_1)
            f.write(line.rstrip().strip(']')+', '+str(pay_0)+', '+str(pay_1)+']\n')

    f.close()


def write_image_pays():
    a = []
    with open('image_test_data.csv', 'r') as f:
        for line in f:
            a.append(line)
    f.close()

    g = open('image_error_rates.txt', 'r')
    cp0_err = 0
    cp1_err = 0
    for line in g:
        cp0_err = float(line.split(',')[0])
        cp1_err = float(line.split(',')[1])
    g.close()

    with open('image_test_data.csv', 'w') as f:
        for line in a:
            pays_0 = []
            pays_1 = []
            refs = line.rstrip().strip('[]').split(', ')[2:]
            for i in range(20):
                ref_ans = refs[np.random.randint(0, len(refs))]
                pays_0.append(payment(0,int(ref_ans), cp0_err, cp1_err, 0.6))
                pays_1.append(payment(1,int(ref_ans), cp0_err, cp1_err, 0.6))
            pay_0 = np.mean(pays_0)
            pay_1 = np.mean(pays_1)
            f.write(line.rstrip().strip(']')+', '+str(pay_0)+', '+str(pay_1)+']\n')

    f.close()

def write_image_pays_pts():
    a = []
    with open('image_test_data_pts.csv', 'r') as f:
        for line in f:
            a.append(line)
    f.close()

    with open('image_test_data_pts.csv', 'w') as f:
        for line in a:
            pays_0 = []
            pays_1 = []
            refs = list(map(int, line.rstrip().strip('[]').split(', ')[2:]))
            for i in range(20):
                ref_ans = refs[np.random.randint(0, len(refs))]
                pays_0.append(payment_PTS(0, refs, ref_ans))
                pays_1.append(payment_PTS(1, refs, ref_ans))
            pay_0 = np.mean(pays_0)
            pay_1 = np.mean(pays_1)
            f.write(line.rstrip().strip(']')+', '+str(pay_0)+', '+str(pay_1)+']\n')

    f.close()

write_image_pays_pts()

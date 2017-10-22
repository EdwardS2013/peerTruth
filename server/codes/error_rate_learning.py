from flask import Flask, make_response, request, current_app
from flask_cors import CORS, cross_origin
import json
app = Flask(__name__)
CORS(app)

##fetch time information
import numpy as np
import linecache

#read priors from somewhere
#P0 = 0.6
#P1 = 1 - P0

@app.route('/error_rate', methods=['GET','POST'])
def error_rate():
    P0 = float(request.form['P0'])
    filename = request.form['filename']

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
    
    #return p0_est,p1_est
    return str(p0_est)+' '+str(p1_est)



#inputs for computing payment: answer, reference answer(randomly selected), error rates p0,p1, priors P0,

#this implements the 1/prior scoring function
@app.route('/payment', methods=['GET','POST'])
def payment():
    ans = int(request.form['ans'])
    pair = int(request.form['pair'])
    p0_est = float(request.form['p0_est'])
    p1_est = float(request.form['p1_est'])
    P0 = float(request.form['p0'])

    #trim brackets, whitespace, then split
    b = linecache.getline('test_data.csv', pair).rstrip()[1:-1].split(', ')
    ref_ans = int(b[np.random.randint(1,len(b))])

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
    print(pay)
    return str(pay)

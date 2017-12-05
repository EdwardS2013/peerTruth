f = open('answers.txt', 'r')
g = open('new answers.txt', 'w')

a = []
for l in f:
    a.append(l)
for k in a:
    if(k[-2] == '1'):
        g.write(k[:-2] + '0\n')
    else:
        g.write(k[:-2] + '1\n')

f.close()
g.close()

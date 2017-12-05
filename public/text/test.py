f = open('answers.txt', 'r')
a = 0
b = 0
for line in f:
    if line[-2] == '1':
        a+=1
    elif line[-2] == '0':
        b+=1

print(a, b)

import sys
import statistics
import json

results_dict = json.loads(sys.argv[1])
names = str(sys.argv[2])
#names = names.replace(" ", "")
for i in names:
    if(i.isalpha() != True and i != ',' and i != ' '):
        names = names.replace(i,"",1)
wordNames = names.split(",")
iterator = 1

for word in wordNames[1:]:
    storageArray = []
    message = "Zero"
    for x in results_dict["default"]["timelineData"]:
        storageArray.append(x["value"][iterator])
    #storage array indices go from 0-118 (2 hour timeframe)
    m = statistics.mean(storageArray[0:100])
    print("Mean for {} is currently: {}".format(word, m))
    for num in storageArray[115:]:
        if(num > m + 3 and num >= max(storageArray[0:105]) and num > 0.5):
            message = ("ALERT: {} up to {} in search trends vs recent mean of {}.".format(word,storageArray[-1], m))
            break
    iterator += 1
    print(message)

#will wind up with messages numbering 2 times the # of words

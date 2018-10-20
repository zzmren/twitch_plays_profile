wordDictionary = {}

def democracy(inputW):
	#word dictionary is global
	#convert to all lowercase and see if in array
	word = inputW.lower()
	if word in wordDictionary:
		wordDictionary[word] += 1 
	else:
		wordDictionary[word] = 1
	#now return until next word
	print(wordDictionary)
	return
	
def mostRepWord():
	#every 5-10 seconds called by global time object, most inputted word is the word added to the doc/webpage
	#now have a count of all repeated words, determine most repeated word
	#set max to the first word for comparison point
	keyList = list(wordDictionary.keys())

	if len(keyList) > 0:
		max = keyList[0]
		for i in keyList:
			if (wordDictionary[i] > wordDictionary[max]):
				max = i
		
		#now have most repeated word
		#clear the wordDictionary
		wordDictionary.clear()
	
		return max

	return ""

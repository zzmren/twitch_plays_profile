#functions to type out the words into the hinder webPage
#testing keyboard 
import keyboard

def printNewLine():
	#print new line
	keyboard.press_and_release('\n')
	return

def printBio(word):
	#print word sent to the function in bio
	if word == "newline":
		printNewLine()
	else:
		keyboard.write(word)
		keyboard.write(' ')
		
	return
	
def completeBio():
	#done writing bio, go to next page
	keyboard.press_and_release('\t')
	keyboard.press_and_release('\n')
	keyboard.press('shift')
	keyboard.press('\t')
	keyboard.release('\t')
	keyboard.release('shift')
	return
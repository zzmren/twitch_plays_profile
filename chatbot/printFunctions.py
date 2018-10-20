#functions to type out the words into the hinder webPage
#testing keyboard 
import keyboard

def printBio(word):
	#print word sent to the function in bio
	keyboard.write(word)
	keyboard.write(' ')
	return

def printNewLine():
	#print new line
	keyboard.press_and_release('\n')
	return
	
def completBio():
	#done writing bio, go to next page
	keyboard.press_and_release('\t')
	keyboard.press_and_release('\n')
	keyboard.press('shift')
	keyboard.press('\t')
	keyboard.release('\t')
	keyboard.release('shift')
	return
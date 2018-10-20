from threading import Thread, Event
import inputProcessing
import keyboard
import printFunctions as bio

class MyThread(Thread):
    def __init__(self, event):
        Thread.__init__(self)
        self.stopped = event

    def run(self):
        while not self.stopped.wait(5):
          word = inputProcessing.mostRepWord()
          if word != "":
            bio.printBio(word)
            # file = open("profile.txt", "a")
            # file.write(word + " ")
            # file.close()
          
          print("my thread")
          # call a function

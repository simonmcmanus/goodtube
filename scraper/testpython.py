#!/usr/bin/env python

from digg import *
d = Digg("tollytvs") #insert your own application key string
stories = d.getStories()
for story in stories:
print story.title
#!/usr/bin/python

'''
2018 by Dieter Meiller
usage: In terminal type: 
python scandir.py ../ > ../examples/data/test.json
(Scans project directory ../ and write into file)
'''
from __future__ import print_function

import os, sys

def scandir(path):
		bFirst = True
 		for item in os.listdir(path):
 			if not bFirst:
 				print (",", end="")
 			else:
 				bFirst = False
 			path_name = os.path.join(path, item)
 			statinfo = os.stat(path_name)
 			#if not item.startswith("."):
 			if not os.path.isdir(path_name):
 				print ("{\"type\":\"file\",\"name\":\"%s\",\"size\":%d,\"children\":[]}" % (path_name, statinfo.st_size), end="")
 			else:
 				print ("{\"type\":\"dir\",\"name\":\"%s\",\"size\":0,\"children\":[" % path_name, end="")
 				scandir(path_name)
 				print("]}", end="")

if len(sys.argv) <= 1:
	print("PLease specify directory")
else:
	print ("{\"type\":\"dir\",\"name\":\"%s\",\"size\":0,\"children\":[" % sys.argv[1], end="")
	scandir(sys.argv[1])
	print ("]}", end="")

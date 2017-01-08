# from urllib.request import urlopen
import requests
from bs4 import BeautifulSoup
import re
import csv
from time import sleep
from config import *
import os.path

# new line problem in db can be solved see: http://stackoverflow.com/questions/35999185/angular2-pipes-output-raw-html
# -- In config --
# url_part1 =
# url_part2 =
# url_img =
# -- end --

# =m&cid=1		# materialer
# =v&cid=1		# videoer

# how to scape a table http://codereview.stackexchange.com/questions/60769/scrape-an-html-table-with-python

myBigList = []

_strakkId = 7743
def html_scraping(strakkId):
	"""
	@param strakkId id of page to be scraped
	will try to scrape the page and retrive images
	"""
	# html = urlopen( url_part1 + str(strakkId) + url_part2)
	html = requests.get( url_part1 + str(strakkId) + url_part2)
	data = html.text
	# bsObj = BeautifulSoup(html)
	bsObj = BeautifulSoup(data, 'html.parser')
	# Grab data in lists
	# title of strakk
	titles = bsObj.findAll("h1", {"class":"pname"})
	# intro to strakk
	intros = bsObj.findAll("div", {"class":"pattern_intro"})
	# price of strakk
	prices = bsObj.findAll("p", {"class":"cost1"})
	# descriptive text of strakk
	txts = bsObj.findAll("div", {"class":"pattern_text"})
	# table of strakk properties
	table = bsObj.findAll(id="diag_symbols")
	# secondary cover images
	niceImg = bsObj.findAll(id="glasscase")
	# Diagram images
	diagramImg = bsObj.findAll("div", {"class":"col-md-pull-3"}) # not ready

	def get_image(id, target, dir, type, optional_name=""):
		"""
		@param target target path for image retrival(need to bee combined with
			baseURL)
		@param dir directory to store image in
		possible dirs at the moment [cover, symbols]
		"""
		# Decide upon a filename, needed so dups of symbols wont happen
		part_of_path = ""
		if optional_name != "":
			part_of_path = str(optional_name)
		else:
			part_of_path = str(id)
		# Check if photo exists if not SAVE it
		if os.path.isfile( "img/" + str(dir) + "/c" + str(part_of_path) + "." + str(type) ):
			print "Image exists - no-op"
		else:
			# write cover photo to file
			resource = requests.get( url_img + target).raw
			r = requests.get(url_img + target, stream=True)
			if r.status_code == 200:
				with open("img/" + str(dir) + "/c" + str(part_of_path) + "." + str(type),"wb") as f:
					for chunk in r:
						f.write(chunk)


	# Symbols and symbolText extraction
	symbols = []
	symbolText = ""
	print "(((((((((((((((((((((((())))))))))))))))))))))))"
	print table
	symbols_link = []
	if len(table) != 0:
		for tab in table:
		    symbols.append(tab.findAll("img", { "src":re.compile('/drops/symbols.*\.gif') }))
	        symbolText = tab.get_text().encode('utf-8').translate(None, '\t').translate(None, '\n').split("=")
		symbolText = filter(None, symbolText) # fastest
		# print symbols
		# print symbolText

		for symbol in symbols[0]:
			_src = symbol["src"]
			symbols_link.append(_src.encode('utf-8'))
			get_image(strakkId, _src, "symbols", "gif", _src.strip("/drops/symbols/").strip(".gif"))
	# all images
	oteherImg = bsObj.findAll("img")
	# need secondary images # /drops/mag/173/51/51b-2.jpg

	# try to find cover photo - regex thet select all imglinks with '/drops/mag' and ends with .jpg
	images = bsObj.findAll("img", {"src":re.compile('/drops/mag.*\.jpg')})
	# print("-------------")
	# print(images)
	#the shortes url matching is always cover photo
	shortestImgUrl = len(images[0]["src"])
	target = images[0]["src"]   # target is the cover photo
	for image in images:
	    if len(image["src"]) < shortestImgUrl:
	        shortestImgUrl = len(image["src"])
	        target = image["src"]
	print("###############")
	print(target)

	# extract secondary cover images
	glassImg = []	# list with div with image
	_glassImage = []	# list of links (pure)
	# Find all img tags in css cclass glassImg
	for div in niceImg:
		glassImg.append(div.findAll("img", { "src":re.compile('/drops/mag.*\.jpg') }))
	for immage in glassImg[0]:
		_src = immage["src"]		# pick the src atribute
		_glassImage.append(_src.strip("/drops/mag/").strip(".jpg").replace("/", "-"))
		if _src != target:
			get_image(strakkId, _src, "cover", "jpg", _src.strip("/drops/mag/").strip(".jpg").replace("/", "-"))
	print "----------- GLASS IMG ----------------"
	print _glassImage
	print "........... END GLASS IMG ............."
	def filter_list(full_list, excludes):
	    s = set(excludes)
	    return (x for x in full_list if x not in s)
	# Extract diagram images
	diagramImgList = []
	_diagramImg = []
	print "////////////////////////////"
	# print diagramImg
	print "////////////////////////////"
	for diagram in diagramImg:
		diagramImgList.append(diagram.findAll("img", { "src":re.compile('/drops/mag.*\.jpg') }))
	for immage in diagramImgList[0]:
		_src = immage["src"]
		if _src in symbols_link:
			continue
		_diagramImg.append(_src.strip("/drops/mag/").strip(".jpg").replace("/", "-").encode('utf-8'))
		if _src != target:
			get_image(strakkId, _src, "cover", "jpg", _src.strip("/drops/mag/").strip(".jpg").replace("/", "-"))



	# enable to get photo, cover is the directory to put the image in
	cover = "cover"
	coverType = "jpg"
	# get_image(strakkId, target, cover, coverType)
	# print("^^^^^^^^^^^^")
	thisDatapoint = []
	thisDatapoint.append(strakkId)
	# becouse title is in a list we have to unpack it to be able to use get_text()
	for title in titles:
	    # print(title.get_text().strip())     # remove leading spaces, have been a problem
	    thisDatapoint.append(str(title.get_text().strip()).encode('utf-8'))
	for intro in intros:
	    # print(intro.get_text())
	    thisDatapoint.append(str(intro.get_text().encode('utf-8')))
	for txt in txts:
	    # print(txt.get_text())
	    thisDatapoint.append(txt.get_text().encode('utf-8'))
	for price in prices:
	    # print(price.get_text())
	    thisDatapoint.append(price.get_text())
	# test multivalue cell # thisDatapoint.append(["one", "two"]) - WORKS!
	thisDatapoint.append("img/cover/c" + _glassImage[0] + ".jpg")
	thisDatapoint.append(symbols_link)	# symbolLink
	thisDatapoint.append(symbolText)	# symbolText
	thisDatapoint.append(_glassImage)	# oteherImg
	thisDatapoint.append(_diagramImg)	# diagramImg

	# TODO: SOLVED - add table to csv file http://stackoverflow.com/questions/3853614/multiple-values-for-one-field-with-comma-separated-values-csv-format
	# TODO: SOLVED - add aa in explanation
	# TODO: SOLVED - add diagram images
	# TODO: improve stability and error catches


	# add all the data to a big list
	myBigList.append(thisDatapoint)

# scrape multiple pages
# 7697,7720
# 4710
# 4710,4730 # good sample
for n in range(4710,4730):
	try:
		html_scraping(n)
	except:
		pass
	sleep(2)
# html_scraping(4719)

# Create a csv file with path to images and the text
# with open("output.csv", "a", newline='', encoding='utf-8') as f:
with open("output.csv", "a") as f:
    writer = csv.writer(f)
    writer.writerow(['strakkId','title','intro','txt','price','coverimg','symbolLink','symbolText', 'otherImg', 'diagramImg'])
    writer.writerows(myBigList)

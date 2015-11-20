# import indicoio
# indicoio.config.api_key = 'd58464ed4f71c725f4d0b4ed0a1ac04c'
# from sentiments.models import Post

# def indicoioInit():
	# print("\nInitializing Sentiment Analysis")
	# allentries = Post.objects.all()
	
	# print(allentries[0])
	
	# count = 0
	
	# for one_entry in allentries:
		# one_entry.value = indicoio.sentiment_hq(one_entry.statement)

		# if (one_entry.value > .5):
			# one_entry.sentiment = "POS"
		# else:
			# one_entry.sentiment = "NEG"
		# one_entry.save()
		# count += 1
		# print("\nProcessed entry "+str(count))
	# print("\nSentiment Analysis Finished")
	
# indicoioInit()
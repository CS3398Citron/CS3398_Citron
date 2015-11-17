import indicoio
import sentiments
from sentiments.models import Post
import json

#obj = Post()

#f = open('myData.json', 'w')
#all_entries = Post.objects.all()


# indicoio.config.api_key = 'd58464ed4f71c725f4d0b4ed0a1ac04c'

# # single example
# data = (indicoio.sentiment_hq("StephenLand @Land_Stephen" + 
# "Like swimming in a glass of ice water. It brrrrrs so good. (@ Deep Eddy Park - @austintexasgov in Austin, TX) swarmapp.com/c/kd7mvZvGEdm" +
# "at 18:23:32 on 8/29/2015"))



# f.write(json.dumps(data, indent=4))



# # batch example
# # data = (indicoio.sentiment([
# #     "indico is so easy to use!",
# #     "I hate the traffic here in austin"
# # ]))
# # f.write(json.dumps(data, indent=4))

# #Calls named_Entities and stores JSON info in data
# #data = indicoio.named_entities("Just watched someone smoke a crack pipe in between 2 dumpsters in Austin... So there's that")

# #Writes to a txt file with the JSON info
# #f.write(json.dumps(data, indent=4))

# data = indicoio.keywords("StephenLand @Land_Stephen" + 
# "Like swimming in a glass of ice water. It brrrrrs so good. (@ Deep Eddy Park - @austintexasgov in Austin, TX) swarmapp.com/c/kd7mvZvGEdm" +
# "at 18:23:32 on 8/29/2015")
# f.write(json.dumps(data, indent=4))
#f.close()





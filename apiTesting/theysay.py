__import__(affectr)

affectr.set_details("Splitusa@gmail.com", "eeZahyahqu8F")

affectr.client.classify_intent(
    "We are planning to implement a real-time data service. " +
    "What are the advantages/disadvantages of using a Foobar-compliant database over Hype.js?"
)[0].intentType
======================
Import / Export
======================

The COA Sentiment Analysis website is able to import and export data from the
admin website - much of this is based on Django's import-export app.

From the admin page (default signin of admin/password), the link to post will show current saved data along with
the ability to import/export.

Features:

* support multiple formats (Excel, CSV, JSON, ...

* admin integration for importing

* preview import changes

* admin integration for exporting

* export data respecting admin filters


To-do:

* Clean up interface

* Write some basic tests

* Convert timestamp to acceptable format

* Integrate sentiment analysis into database

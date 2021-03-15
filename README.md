# trendBot

## Usage
This bot uses the Google Trends API and Twitter API to trigger alerts when certain words jump in popularity. My initial intent was to use this to track SPAC activity, but it can be used in a variety of other ways as well. Discord alerts (using a Discord bot) are implemented in the project.

## Requirements
This project cannot run given only the code here. You must have node installed, a Twitter developer account, a discord channel with a bot enabled, a config file with a Discord bot token and Twitter API key, etc. The code here is just to provide some direction for people looking to track trending words on Google trends or Twitter, or it could be directly copied into an existing Discord bot (as long as you have a Twitter API key). If everything is set up and you wish to run the bot locally, simply run "node index.js".

I will also note that the words tracked, cooldown time on alerts for words, frequency of trend checking, and baseline requirements for alerts (in Python file) can all be configured to match the needed use case.

EDIT: The Twitter part of the bot is currently down due to changes in the API. I have commented out all Twitter-related code. 

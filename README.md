1. create a telegram bot https://sendpulse.com/knowledge-base/chatbot/create-telegram-chatbot
2. (this is optional) create a new channel and add the bot as admin
3. Find the chat id https://stackoverflow.com/a/32572159
4. Find the district id from https://www.cowin.gov.in/home Select your state/district and notice the districtId sent as part of "calendarByDistrict" call
5. Update the .env file
6. Run "npm i"
7. Run "pm2 start vaccineNotifier.js"

To stop "pm2 stop vaccineNotifier.js && pm2 delete vaccineNotifier.js"

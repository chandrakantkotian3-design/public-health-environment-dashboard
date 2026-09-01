COMMUNITY PULSE — LIVE SURVEY DASHBOARD
========================================

This version has NO login and NO registration system.

STARTING DATA
-------------
The project contains 6 real responses imported from the CSV supplied for the project.
Duplicate Google Form columns were cleaned by using one consistent copy of each repeated question.

HOW IT WORKS
------------
1. Anyone opens the website.
2. The live dashboard shows statistics from all saved responses.
3. The visitor can scroll to the survey and submit a new response.
4. The Express backend saves it into data/db.json.
5. Dashboard statistics and charts update immediately.

PRIVACY
-------
Name and email are never displayed in the public dashboard.
They are only stored in the local dataset so the project can identify submissions.
Public charts show aggregated statistics only.

RUN
---
1. Install Node.js LTS.
2. Extract the ZIP.
3. Open a terminal inside the project folder.
4. Run: npm install
5. Run: npm start
6. Open: http://localhost:3000

IMPORTANT
---------
Do not double-click index.html for the live version because the dashboard needs the backend.
For a real public deployment, use a hosted database rather than a local JSON file.


GOOGLE FORM LINK
----------------
The website now contains a direct button to the original Google Form:
https://docs.google.com/forms/d/e/1FAIpQLScyu5ZF4WK4HTHbKuid-fpvJYyaF5fv4jjavvcgMW4nqzDDLQ/viewform?usp=header

Important:
The 6 existing responses from the Google Form are already imported.
New WEBSITE form submissions update the dashboard automatically.

New GOOGLE FORM submissions will NOT automatically appear on the website
until the Google Form response Sheet is connected to the website backend.

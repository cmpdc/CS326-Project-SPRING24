# MeetUp

Meetup is an event management app.

## Milestone #01 (Proposal)

Initiated proposal for this project. This can be located inside the `docs` folder.

To visit this proposal documentation, run `npm run milestone-01`.

## Milestone #02 (Front-End)

To run and view this project's progress, execute `npm run milestone-02`.

In this milestone, the files can be located in the `client` folder.

### Tasks List:

_Server:_

-   [ ] Properly implement the use **PouchDB**

_Pages:_

-   [x] SPA implementation for each pages
-   [ ] Window history manager
-   [x] Landing page - `client/initial` folder (Annanta)
    -   [x] should work when accessing the `/` route or without any subsequent paths.
-   [x] Login/Registration page - `client/access` folder (Jason)
    -   [x] `/access` route
-   [x] Dashboard page - `client/dashboard` folder (Christian and Justin)
    -   [x] `/dashboard` route
    -   [x] Dynamic pages for each selected event (This should only be accessible inside `/dashboard` route)
    -   [x] Current page - should be in `/current` route.
        -   [ ] Should update when new events are created. Use PouchDB.
    -   [ ] A way to "logout" once users are inside the the `/dashboard` route — perhaps backend?

_Components:_

-   [x] Calendar Picker
-   [x] Time Picker

_API:_

-   [x] Geolocation (Map) - [Leaflet](https://leafletjs.com/)
-   [ ] Geolocation (Tracker)

## Milestone #03 (Back-End)

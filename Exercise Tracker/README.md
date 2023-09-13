# Tests to Pass

1. You should provide your own project, not the example URL.
2. You can POST to /api/users with form data username to create a new user.
3. The returned response from POST /api/users with form data username will be an object with username and _id properties.
4. You can make a GET request to /api/users to get a list of all users.
5. The GET request to /api/users returns an array.
6. Each element in the array returned from GET /api/users is an object literal containing a user's username and _id.
7. You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.
8. The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added.
9. You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
11. A request to a user's log GET /api/users/:_id/logs returns a user object with a count property representing the number of exercises that belong to that user.
12. A GET request to /api/users/:_id/logs will return the user object with a log array of all the exercises added.
13. Each item in the log array that is returned from GET /api/users/:_id/logs is an object that should have a description, duration, and date properties.
14. The description property of any object in the log array that is returned from GET /api/users/:_id/logs should be a string.
15. The duration property of any object in the log array that is returned from GET /api/users/:_id/logs should be a number.
16. The date property of any object in the log array that is returned from GET /api/users/:_id/logs should be a string. Use the dateString format of the Date API.
17. You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.

# Response structure...
1. Exercise:
    {
      username: "fcc_test",
      description: "test",
      duration: 60,
      date: "Mon Jan 01 1990",
      _id: "5fb5853f734231456ccb3b05"
    }

2. User:
    {
      username: "fcc_test",
      _id: "5fb5853f734231456ccb3b05"
    }

3. Log:
    {
      username: "fcc_test",
      count: 1,
      _id: "5fb5853f734231456ccb3b05",
      log: [{
        description: "test",
        duration: 60,
        date: "Mon Jan 01 1990",
      }]
    }

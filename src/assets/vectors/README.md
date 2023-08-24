# Vårdföretaget
This is the initial README of Vårdföretaget. This project uses Laravel.
## RPC API Documentation
We use a local API to communicate between Laravel and the frontend. Authentication is done by a normal login session flow. Routes are protected by CSRF.
### Test data
Run `php artisan migrate` followed by `php artisan db:seed` to seed the database with test data. You now have a user called `tommie+test@lagerroos.nu` with the password `superhemligt`.
### Authentication
#### POST /rpc/authenticate/user
**Request Header:**
```Accept: application/json```

**Request Body:**
```
email: string,
password: string
```

**Response body:**
```
{
    "success": boolean,
    "message": "login_successful"|"invalid_credentials",
    "user": {
        "id": 2,
        "firstname": "Tommie",
        "lastname": "Lagerroos",
        "phone": "6546565464",
        "email": "tommie@lagerroos.nu",
        "email_verified_at": "2021-10-05T09:31:41.000000Z",
        "created_at": "2021-10-05T09:31:31.000000Z",
        "updated_at": "2021-10-05T09:31:41.000000Z",
        "experience": [],
        "work_experience": [],
        "university_experience": [],
        "type": "user"
    },
    "type": "user"
}
```
#### POST /rpc/authenticate/company
**Request Header:**
```Accept: application/json```

**Request Body:**
```
{
    "email": string,
    "password": string
}
```

**Response body:**
```
{
    "success": boolean,
    "message": "login_successful"|"invalid_credentials",
    "user": {
        "id": 2,
        "firstname": "Tommie",
        "lastname": "Lagerroos",
        "phone": "6546565464",
        "email": "tommie@lagerroos.nu",
        "email_verified_at": "2021-10-05T09:31:41.000000Z",
        "created_at": "2021-10-05T09:31:31.000000Z",
        "updated_at": "2021-10-05T09:31:41.000000Z",
        "experience": [],
        "work_experience": [],
        "university_experience": [],
        "type": "company"
    },
    "company": {
        "id": 2,
        "firstname": "Test nu",
        "lastname": "Efternamn",
        "phone": "071-234 56 79",
        "email": "tommie+test@lagerroos.nu",
        "type": "company",
        "email_verified_at": "2021-10-13T05:12:48.000000Z",
        "created_at": "2021-10-13T05:12:48.000000Z",
        "updated_at": "2021-10-13T05:12:48.000000Z",
        "experience": [],
        "pivot": {
            "user_id": 2
        },
        "work_experience": [],
        "university_experience": []
    },
    "type": "company"
}
```
#### GET /rpc/user/me
**Request Header:**
```Accept: application/json```

**Response body:**
```
{
    "success": true,
    "message": "session_valid",
    "user": {
        "id": 2,
        "firstname": "Test nu",
        "lastname": "Efternamn",
        "phone": "071-234 56 79",
        "email": "tommie+test@lagerroos.nu",
        "type": "company",
        "email_verified_at": "2021-10-13T05:12:48.000000Z",
        "created_at": "2021-10-13T05:12:48.000000Z",
        "updated_at": "2021-10-13T05:12:48.000000Z",
        "experience": [],
        "work_experience": [],
        "university_experience": []
    },
    "type": "company"
}
```
#### GET /rpc/me
**Request Header:**
```Accept: application/json```

**Response body:**
```
{
    "success": true,
    "message": "session_valid",
    "user": {
        "id": 2,
        "firstname": "Test nu",
        "lastname": "Efternamn",
        "phone": "071-234 56 79",
        "email": "tommie+test@lagerroos.nu",
        "type": "company",
        "email_verified_at": "2021-10-13T05:12:48.000000Z",
        "created_at": "2021-10-13T05:12:48.000000Z",
        "updated_at": "2021-10-13T05:12:48.000000Z",
        "experience": [],
        "work_experience": [],
        "university_experience": []
    },
    "type": "company"
}
```
#### GET /rpc/logout
**Request Header:**
```Accept: application/json```

**Response body:**
```
{
    "success": true,
    "message": "session_destroyed"
}
```
### Password reset
#### POST /rpc/reset/request
**Request Header:**
```Accept: application/json```

**Request Body:**
```
{
    "email": string
}
```

**Response body:**
```
{
    "success": true,
    "message": "password_reset_sent"
}
```

**Error body:**
```
{
    "message": "The given data was invalid.",
    "errors": {
        "email": [
            "E-postadress måste innehålla en korrekt e-postadress."
        ]
    }
}
```
#### POST /rpc/reset/consume
**Request Header:**
```Accept: application/json```

**Request Body:**
```
{
    "email": string,
    "password": string,
    "password_confirmation": string,
    "token": string
}
```

**Response body:**
```
{
    "success": true,
    "message": "password_reset_successful"
}
```

**Error body:**
```
{
    "message": "The given data was invalid.",
    "errors": {
        "token": [
            "Token är obligatoriskt."
        ],
        "email": [
            "E-postadress måste innehålla en korrekt e-postadress."
        ],
        "password": [
            "Lösenord är obligatoriskt."
        ]
    }
}
```
### Regions
#### GET /rpc/region
**Request Header:**
```Accept: application/json```

**Response body:**
```
{
    "success": true,
    "message": "region_list",
    "regions": [
        {
            "id": 1,
            "name": "Stockholm",
            "abbreviation": "AB",
            "country_code": "SE",
            "created_at": "2021-10-05T12:40:57.000000Z",
            "updated_at": "2021-10-05T12:40:57.000000Z"
        },
        {
            "id": 2,
            "name": "Uppsala",
            "abbreviation": "C",
            "country_code": "SE",
            "created_at": "2021-10-05T12:40:57.000000Z",
            "updated_at": "2021-10-05T12:40:57.000000Z"
        },
...
    ]
}
```
#### GET /rpc/region/:id
**Request Header:**
```Accept: application/json```

**Response body:**
```
{
    "success": true,
    "message": "single_region",
    "region": {
        "id": 1,
        "name": "Stockholm",
        "abbreviation": "AB",
        "country_code": "SE",
        "created_at": "2021-10-05T12:40:57.000000Z",
        "updated_at": "2021-10-05T12:40:57.000000Z"
    }
}
```
### Work request
#### POST /rpc/work_request
_Used to create work request from a user._

**Request Header:**
```Accept: application/json```

**Response body:**
```
{
    "success": true,
    "message": "work_request_created",
    "work_request": {
        "id": 1,
        "region_id": region id,
        "from": 2021-01-01,
        "to": 2021-10-10,
        "permanent": boolean,
        "remuneration": "sallary"|"consulting",
        "include_travel_costs": boolean,
        "include_living_costs": boolean,
        "special_requirements": string
    }
}
```
#### GET /rpc/work_request
_Used to list work request. See below for possible filtering options._

**Request Header:**
```Accept: application/json```

**Request Params:**
```
{
    "region_id": [1,2], // Integer or array of integers. ID of regions to filter
    "from": "2021-10-17",
    "to": "2021-11-18",
    "remuneration": ["sallary", "consulting"], // String or array. Can be "sallary" or "consulting".
    "include_travel_costs": true, // Boolean or array of booleans
    "include_living_costs": [false, true], // Boolean or array of booleans
    "sallary_claim": 30000 // Double, max sallary claim
}
```

**Response body:**
```
{
    "success": true,
    "work_requests": [
        {
            "id": 1,
            "user_id": 1,
            "region_id": 1,
            "from": "2021-10-13T05:12:49.000000Z",
            "to": "2021-11-13T05:12:49.000000Z",
            "permanent": 0,
            "remuneration": "sallary",
            "include_travel_costs": 1,
            "include_living_costs": 0,
            "special_requirements": "",
            "fulfilled": 0,
            "created_at": "2021-10-13T05:12:49.000000Z",
            "updated_at": "2021-10-13T05:12:49.000000Z",
            "region": {
                "id": 1,
                "name": "Stockholm",
                "abbreviation": "AB",
                "country_code": "SE",
                "created_at": "2021-10-13T05:12:48.000000Z",
                "updated_at": "2021-10-13T05:12:48.000000Z"
            },
            "user": {
                "id": 1,
                "firstname": "Test",
                "lastname": "test",
                "phone": "071-234 56 79",
                "email": "tommie+test@lagerroos.nu",
                "type": "user",
                "email_verified_at": "2021-10-13T05:12:48.000000Z",
                "created_at": "2021-10-13T05:12:48.000000Z",
                "updated_at": "2021-10-13T05:12:48.000000Z",
                "experience": [],
                "work_experience": [],
                "university_experience": [],
                "professions": []
            }
        }
    ]
}
```
#### GET /rpc/work_request/own
_Used to list own chats that's ongoing._

**Request Header:**
```Accept: application/json```

**Response body:**
```
{
    "success": true,
    "work_requests": [
        {
            "id": 1,
            "user_id": 1,
            "region_id": 1,
            "from": "2021-10-13T05:12:49.000000Z",
            "to": "2021-11-13T05:12:49.000000Z",
            "permanent": 0,
            "remuneration": "sallary",
            "include_travel_costs": 1,
            "include_living_costs": 0,
            "special_requirements": "",
            "fulfilled": 0,
            "created_at": "2021-10-13T05:12:49.000000Z",
            "updated_at": "2021-10-13T05:12:49.000000Z",
            "region": {
                "id": 1,
                "name": "Stockholm",
                "abbreviation": "AB",
                "country_code": "SE",
                "created_at": "2021-10-13T05:12:48.000000Z",
                "updated_at": "2021-10-13T05:12:48.000000Z"
            },
            "user": {
                "id": 1,
                "firstname": "Test",
                "lastname": "test",
                "phone": "071-234 56 79",
                "email": "tommie+test@lagerroos.nu",
                "type": "user",
                "email_verified_at": "2021-10-13T05:12:48.000000Z",
                "created_at": "2021-10-13T05:12:48.000000Z",
                "updated_at": "2021-10-13T05:12:48.000000Z",
                "experience": [],
                "work_experience": [],
                "university_experience": [],
                "professions": []
            },
            "conversations": [
                {
                    "id": 1,
                    "private": true,
                    "direct_message": true,
                    "data": [],
                    "created_at": "2021-10-13T05:12:49.000000Z",
                    "updated_at": "2021-10-13T05:12:49.000000Z",
                    "pivot": {
                        "work_request_id": 1,
                        "chat_conversations_id": 1
                    }
                }
            ]
        }
    ]
}
```
#### DELETE /rpc/work_request/:id
_Used by a user to delete a work request._

**Request Header:**
```Accept: application/json```

**Response body:**
```
{
    "success": true,
    "message": "work_request_deleted",
}
```
#### PUT /rpc/work_request/:id
_Used by a user to update a work request._

**Request Header:**
```Accept: application/json```

**Request Body:**
```
{
    "region_id": region id,
    "from": 2021-01-01,
    "to": 2021-10-10,
    "permanent": boolean,
    "remuneration": "sallary"|"consulting",
    "include_travel_costs": boolean,
    "include_living_costs": boolean,
    "special_requirements": string
}
```

**Response body:**
```
{
    "success": true,
    "message": "work_request_updated",
    "work_request": {
        "id": 1,
        "region_id": region id,
        "from": 2021-01-01,
        "to": 2021-10-10,
        "permanent": boolean,
        "remuneration": "sallary"|"consulting",
        "include_travel_costs": boolean,
        "include_living_costs": boolean,
        "special_requirements": string
    }
}
```
#### GET /rpc/work_request/:id
_Used to get details on a specific work request._

**Request Header:**
```Accept: application/json```

**Response body:**
```
{
    "success": true,
    "message": "work_request_exists",
    "work_request": {
        "id": 1,
        "region_id": region id,
        "from": 2021-01-01,
        "to": 2021-10-10,
        "permanent": boolean,
        "remuneration": "sallary"|"consulting",
        "include_travel_costs": boolean,
        "include_living_costs": boolean,
        "special_requirements": string
    }
}
```
**Error body:**
```
{
    "success": false,
    "message": "permission_denied"
}
```
#### POST /rpc/work_request/:id
*Used to open chat as a company with a user. Only use this when you send the first message as a company*

**Request Header:**
```Accept: application/json```

**Request Body:**
```
{
    "company_id": company id,
    "message": string"
}
```

**Response body:**
```
{
    "success": true,
    "message": "conversation_started",
    "conversation": {
        "id": 3,
        "private": true,
        "direct_message": true,
        "data": [],
        "created_at": "2021-10-13T05:45:10.000000Z",
        "updated_at": "2021-10-13T05:45:11.000000Z"
    }
}
```

**Error Body**
```
{
    "success": false,
    "message": "conversation_already_exists",
    "conversation": {
        "id": 1,
        "private": true,
        "direct_message": true,
        "data": [],
        "created_at": "2021-10-13T05:12:49.000000Z",
        "updated_at": "2021-10-13T05:12:49.000000Z"
    }
}
```
#### GET /rpc/work_request/:id/conversation/:id
_Used to get messages from a specific conersation, retieved in `GET /rpc/work_request/own`._

**Request Header:**
```Accept: application/json```

**Response body:**
```
{
    "success": true,
    "message": "messages_list_successful",
    "messages": {
        "current_page": 1,
        "data": [
            {
                "read_at": null,
                "deleted_at": null,
                "messageable_id": 1,
                "notification_id": 5,
                "is_seen": 1,
                "is_sender": 1,
                "id": 3,
                "body": "Testar",
                "conversation_id": 3,
                "participation_id": 6,
                "type": "text",
                "created_at": "2021-10-13T05:45:10.000000Z",
                "updated_at": "2021-10-13T05:45:10.000000Z",
                "sender": {
                    "id": 1,
                    "name": "Företagets namn AB",
                    "organisational_number": "559051-1010",
                    "phone": null,
                    "email": null,
                    "created_at": "2021-10-13T05:12:48.000000Z",
                    "updated_at": "2021-10-13T05:12:48.000000Z",
                    "participation": [
                        {
                            "id": 2,
                            "conversation_id": 1,
                            "messageable_id": 1,
                            "messageable_type": "App\\Models\\Company",
                            "settings": null,
                            "created_at": "2021-10-13T05:12:49.000000Z",
                            "updated_at": "2021-10-13T05:12:49.000000Z"
                        },
                        {
                            "id": 4,
                            "conversation_id": 2,
                            "messageable_id": 1,
                            "messageable_type": "App\\Models\\Company",
                            "settings": null,
                            "created_at": "2021-10-13T05:44:10.000000Z",
                            "updated_at": "2021-10-13T05:44:10.000000Z"
                        },
                        {
                            "id": 6,
                            "conversation_id": 3,
                            "messageable_id": 1,
                            "messageable_type": "App\\Models\\Company",
                            "settings": null,
                            "created_at": "2021-10-13T05:45:10.000000Z",
                            "updated_at": "2021-10-13T05:45:10.000000Z"
                        }
                    ]
                },
                "participation": {
                    "id": 6,
                    "conversation_id": 3,
                    "messageable_id": 1,
                    "messageable_type": "App\\Models\\Company",
                    "settings": null,
                    "created_at": "2021-10-13T05:45:10.000000Z",
                    "updated_at": "2021-10-13T05:45:10.000000Z",
                    "messageable": {
                        "id": 1,
                        "name": "Företagets namn AB",
                        "organisational_number": "559051-1010",
                        "phone": null,
                        "email": null,
                        "created_at": "2021-10-13T05:12:48.000000Z",
                        "updated_at": "2021-10-13T05:12:48.000000Z",
                        "participation": [
                            {
                                "id": 2,
                                "conversation_id": 1,
                                "messageable_id": 1,
                                "messageable_type": "App\\Models\\Company",
                                "settings": null,
                                "created_at": "2021-10-13T05:12:49.000000Z",
                                "updated_at": "2021-10-13T05:12:49.000000Z"
                            },
                            {
                                "id": 4,
                                "conversation_id": 2,
                                "messageable_id": 1,
                                "messageable_type": "App\\Models\\Company",
                                "settings": null,
                                "created_at": "2021-10-13T05:44:10.000000Z",
                                "updated_at": "2021-10-13T05:44:10.000000Z"
                            },
                            {
                                "id": 6,
                                "conversation_id": 3,
                                "messageable_id": 1,
                                "messageable_type": "App\\Models\\Company",
                                "settings": null,
                                "created_at": "2021-10-13T05:45:10.000000Z",
                                "updated_at": "2021-10-13T05:45:10.000000Z"
                            }
                        ]
                    }
                }
            }
        ],
        "first_page_url": "https://vardforetaget/rpc/work_request/3/conversation/3?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "https://vardforetaget/rpc/work_request/3/conversation/3?page=1",
        "links": [
            {
                "url": null,
                "label": "&laquo; Föregående",
                "active": false
            },
            {
                "url": "https://vardforetaget/rpc/work_request/3/conversation/3?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": null,
                "label": "Nästa &raquo;",
                "active": false
            }
        ],
        "next_page_url": null,
        "path": "https://vardforetaget/rpc/work_request/3/conversation/3",
        "per_page": 25,
        "prev_page_url": null,
        "to": 1,
        "total": 1
    }
}
```
#### POST /rpc/work_request/:id/conversation/:id/message
_Used to send a message to an existing conversation, both as company and user._

**Request Header:**
```Accept: application/json```

**Request Body:**
```
{
    "message": string
}
```

**Response body:**
```
{
    "success": true,
    "message": "sent_message_successfully",
    "messages": {
        "current_page": 1,
        "data": [
            {
                "read_at": null,
                "deleted_at": null,
                "messageable_id": 1,
                "notification_id": 5,
                "is_seen": 1,
                "is_sender": 1,
                "id": 3,
                "body": "Testar",
                "conversation_id": 3,
                "participation_id": 6,
                "type": "text",
                "created_at": "2021-10-13T05:45:10.000000Z",
                "updated_at": "2021-10-13T05:45:10.000000Z",
                "sender": {
                    "id": 1,
                    "name": "Företagets namn AB",
                    "organisational_number": "559051-1010",
                    "phone": null,
                    "email": null,
                    "created_at": "2021-10-13T05:12:48.000000Z",
                    "updated_at": "2021-10-13T05:12:48.000000Z",
                    "participation": [
                        {
                            "id": 2,
                            "conversation_id": 1,
                            "messageable_id": 1,
                            "messageable_type": "App\\Models\\Company",
                            "settings": null,
                            "created_at": "2021-10-13T05:12:49.000000Z",
                            "updated_at": "2021-10-13T05:12:49.000000Z"
                        },
                        {
                            "id": 4,
                            "conversation_id": 2,
                            "messageable_id": 1,
                            "messageable_type": "App\\Models\\Company",
                            "settings": null,
                            "created_at": "2021-10-13T05:44:10.000000Z",
                            "updated_at": "2021-10-13T05:44:10.000000Z"
                        },
                        {
                            "id": 6,
                            "conversation_id": 3,
                            "messageable_id": 1,
                            "messageable_type": "App\\Models\\Company",
                            "settings": null,
                            "created_at": "2021-10-13T05:45:10.000000Z",
                            "updated_at": "2021-10-13T05:45:10.000000Z"
                        }
                    ]
                },
                "participation": {
                    "id": 6,
                    "conversation_id": 3,
                    "messageable_id": 1,
                    "messageable_type": "App\\Models\\Company",
                    "settings": null,
                    "created_at": "2021-10-13T05:45:10.000000Z",
                    "updated_at": "2021-10-13T05:45:10.000000Z",
                    "messageable": {
                        "id": 1,
                        "name": "Företagets namn AB",
                        "organisational_number": "559051-1010",
                        "phone": null,
                        "email": null,
                        "created_at": "2021-10-13T05:12:48.000000Z",
                        "updated_at": "2021-10-13T05:12:48.000000Z",
                        "participation": [
                            {
                                "id": 2,
                                "conversation_id": 1,
                                "messageable_id": 1,
                                "messageable_type": "App\\Models\\Company",
                                "settings": null,
                                "created_at": "2021-10-13T05:12:49.000000Z",
                                "updated_at": "2021-10-13T05:12:49.000000Z"
                            },
                            {
                                "id": 4,
                                "conversation_id": 2,
                                "messageable_id": 1,
                                "messageable_type": "App\\Models\\Company",
                                "settings": null,
                                "created_at": "2021-10-13T05:44:10.000000Z",
                                "updated_at": "2021-10-13T05:44:10.000000Z"
                            },
                            {
                                "id": 6,
                                "conversation_id": 3,
                                "messageable_id": 1,
                                "messageable_type": "App\\Models\\Company",
                                "settings": null,
                                "created_at": "2021-10-13T05:45:10.000000Z",
                                "updated_at": "2021-10-13T05:45:10.000000Z"
                            }
                        ]
                    }
                }
            },
            {
                "read_at": null,
                "deleted_at": null,
                "messageable_id": 1,
                "notification_id": 7,
                "is_seen": 1,
                "is_sender": 1,
                "id": 4,
                "body": "Ett testmeddelande",
                "conversation_id": 3,
                "participation_id": 6,
                "type": "text",
                "created_at": "2021-10-13T06:10:46.000000Z",
                "updated_at": "2021-10-13T06:10:46.000000Z",
                "sender": {
                    "id": 1,
                    "name": "Företagets namn AB",
                    "organisational_number": "559051-1010",
                    "phone": null,
                    "email": null,
                    "created_at": "2021-10-13T05:12:48.000000Z",
                    "updated_at": "2021-10-13T05:12:48.000000Z",
                    "participation": [
                        {
                            "id": 2,
                            "conversation_id": 1,
                            "messageable_id": 1,
                            "messageable_type": "App\\Models\\Company",
                            "settings": null,
                            "created_at": "2021-10-13T05:12:49.000000Z",
                            "updated_at": "2021-10-13T05:12:49.000000Z"
                        },
                        {
                            "id": 4,
                            "conversation_id": 2,
                            "messageable_id": 1,
                            "messageable_type": "App\\Models\\Company",
                            "settings": null,
                            "created_at": "2021-10-13T05:44:10.000000Z",
                            "updated_at": "2021-10-13T05:44:10.000000Z"
                        },
                        {
                            "id": 6,
                            "conversation_id": 3,
                            "messageable_id": 1,
                            "messageable_type": "App\\Models\\Company",
                            "settings": null,
                            "created_at": "2021-10-13T05:45:10.000000Z",
                            "updated_at": "2021-10-13T05:45:10.000000Z"
                        }
                    ]
                },
                "participation": {
                    "id": 6,
                    "conversation_id": 3,
                    "messageable_id": 1,
                    "messageable_type": "App\\Models\\Company",
                    "settings": null,
                    "created_at": "2021-10-13T05:45:10.000000Z",
                    "updated_at": "2021-10-13T05:45:10.000000Z",
                    "messageable": {
                        "id": 1,
                        "name": "Företagets namn AB",
                        "organisational_number": "559051-1010",
                        "phone": null,
                        "email": null,
                        "created_at": "2021-10-13T05:12:48.000000Z",
                        "updated_at": "2021-10-13T05:12:48.000000Z",
                        "participation": [
                            {
                                "id": 2,
                                "conversation_id": 1,
                                "messageable_id": 1,
                                "messageable_type": "App\\Models\\Company",
                                "settings": null,
                                "created_at": "2021-10-13T05:12:49.000000Z",
                                "updated_at": "2021-10-13T05:12:49.000000Z"
                            },
                            {
                                "id": 4,
                                "conversation_id": 2,
                                "messageable_id": 1,
                                "messageable_type": "App\\Models\\Company",
                                "settings": null,
                                "created_at": "2021-10-13T05:44:10.000000Z",
                                "updated_at": "2021-10-13T05:44:10.000000Z"
                            },
                            {
                                "id": 6,
                                "conversation_id": 3,
                                "messageable_id": 1,
                                "messageable_type": "App\\Models\\Company",
                                "settings": null,
                                "created_at": "2021-10-13T05:45:10.000000Z",
                                "updated_at": "2021-10-13T05:45:10.000000Z"
                            }
                        ]
                    }
                }
            }
        ],
        "first_page_url": "https://vardforetaget/rpc/work_request/3/conversation/3/message?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "https://vardforetaget/rpc/work_request/3/conversation/3/message?page=1",
        "links": [
            {
                "url": null,
                "label": "&laquo; Föregående",
                "active": false
            },
            {
                "url": "https://vardforetaget/rpc/work_request/3/conversation/3/message?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": null,
                "label": "Nästa &raquo;",
                "active": false
            }
        ],
        "next_page_url": null,
        "path": "https://vardforetaget/rpc/work_request/3/conversation/3/message",
        "per_page": 25,
        "prev_page_url": null,
        "to": 2,
        "total": 2
    }
}
```
#### POST /rpc/work_request/:id/company/:id/update_acceptance_status

_Used to change acceptance status of a work request, from both user and company._

**Request Header:**
```Accept: application/json```

**Request Body:**
```
{
    "acceptance_status": "denied"|"hold"|"accepted"
}
```

**Response body:**
```
{
    "success": true,
    "message": "user_acceptance_status_updated"
}
```

# REST API
Version 4 of Rätt Spår uses a rest API mounted to `/v4/api`, to contrast it against `/v4`, which provides our frontend, and `/` which currently provides version 3 of the software.

Below is a list of all valid endpoints. Open endpoints do not require authentication while closed endpoints require authentication via a valid token.

## Open endpoints
  *
## Closed endpoints
  * `/core/notes/`
    * [`{journalId}`](core/notes.md)
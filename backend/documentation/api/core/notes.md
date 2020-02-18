<a name="endpoints"></a>
* [`notes/:journal`](#notes/:journal)
* [`notes/:journal/:id`](#notes/:journal/:id)
<a name="notes/:journal"></a>
# notes/:journal [#](#endpoints)

Get a list of notes for a given journal ID

## Methods
<a name="top"></a>
* [`GET`](#GET)
* [`POST`](#POST)
* [`PUT`](#PUT)
* [`DELETE`](#DELETE)


## <a name="GET"></a>`GET` [#](#top)

**Open**: no

**Permissions**:
`Notes.:journal.read`

**Parameters**:
```
journal:  string
```

*Parameter Requirements*:

`start`, `limit`, `startDate`, `endDate` >= 0

**Body**
```typescript
endDate:    number  [0]
limit:      number  [20]
order:      string  ["desc"]
sortBy:     string  ["eventDateTime"]
start:      number  [0]
startDate:  number  [0]
```

## Succesful responses
**Code**: `200 OK`

**Body**:

Body description
```typescript
{
  data: {
    notes: [
      {
        _id: string,            // Identifier string for the note
        eventDateTime: string,    // Timestamp of note's event date
        journal: {
          _id: string,          // Identifier string for the 
                                // journal - should be the same as journal
          name: string,         // Human-readable name of journal
        },
        keywords: string[],     // A list of keywords attached to note.
        versions: [
          {
           versionText: string, // The text body of the note version
           author: {
             _id: string,       // Identifier string for the author of this note version.
             name: string,      // Name of the user
             title: string,     // Title of the user
           },
           created: string,       // Javascript date for when this note version was created.
          }
        ]
      }
    ],
    total: number,              // Total number of notes, used for pagination
    links: {
      self: string,             // A self-referential url for this result. A GET request to this URL should provide this same result as long as the state has not changed.
      next: string,             // Url for fetching the next page of notes
      previous: string,         // Url for fetching the previous page of notes
    }
  }
}
```

## Unsuccesful responses
**Code**: `400 Bad Request`

**Cause**: Invalid parameters

**Body**

```typescript
{
  message: 'Invalid parameters'
}
```

**Code**: `403 Forbidden`

**Cause**: Invalid permissions

**Body**
```typescript
{
  message: 'Forbidden action'
}
```

## Notes

## <a name="POST"></a>`POST` [#](#top)

**Open**: no

**Permissions**:
`Notes.:journal.create`

**Parameters**:
```
journal:     string
```

**Request Body**:
```
{
  keywords:      string[]
  eventDateTime: string
  versionText:   string
}
```
## Succesful responses
**Code**: `201 Created`

**Body**:

Body description
```typescript
{
  data: {
    note: {
      _id: string,            // Identifier string for the note
      eventDateTime: string,    // Timestamp of note's event date
      journal: {
        _id: string,          // Identifier string for the 
                              // journal - should be the same as journal
        name: string,         // Human-readable name of journal
      },
      keywords: string[],     // A list of keywords attached to note.
      versions: [
        {
          versionText: string, // The text body of the note version
          author: {
            _id: string,       // Identifier string for the author of this note version.
            name: string,      // Name of the user
            title: string,     // Title of the user
          },
          created: string,       // Javascript date for when this note version was created.
        }
      }
    ],
    links: {
      self: string,             // URL for getting the newly created note.
    }
  }
}
```

## Unsuccesful responses
**Code**: `400 Bad Request`

**Cause**: Invalid parameters

**Body**

Body description
```typescript
{
  message: 'Invalid Parameters'
}

**Code**: `403 Forbidden`

**Cause**: Invalid permissions

**Body**

Body description
```typescript
{
  message: 'Forbidden Action'
}
```

<a name="notes/:journal/:id"></a>
# notes/:journal/:id [#](#endpoints)

Actions taken on specific notes, referenced by journal and note id.

## Methods
<a name="_top"></a>
* [`GET`](#_GET)
* [`PUT`](#PUT)
* [`DELETE`](#DELETE)

## <a name="_GET"></a>`GET` [#](#_top)
**Open**: no

**Permissions**:
`Notes.:journal.read`

**Parameters**:
```
journal:  string
id:       string
```

## Succesful responses
**Code**: `200 Ok`

**Body**:
```typescript
{
  data: {
    note: {
      _id: string,            // Identifier string for the note
      eventDateTime: string,    // Timestamp of note's event date
      journal: {
        _id: string,          // Identifier string for the 
                              // journal - should be the same as journal
        name: string,         // Human-readable name of journal
      },
      keywords: string[],     // A list of keywords attached to note.
      versions: [
        {
          versionText: string, // The text body of the note version
          author: {
            _id: string,       // Identifier string for the author of this note version.
            name: string,      // Name of the user
            title: string,     // Title of the user
          },
          created: string,       // Javascript date for when this note version was created.
        }
      }
    ],
    links: {
      self: string,             // URL for getting the newly created note.
    }
  }
}
```

## Unsuccesful responses
**Code**: `400 Bad Request`

**Cause**: Invalid parameters

**Body**:
```typescript
{
  message: 'Invalid Parameters'
}
```

## <a name="PUT"></a>`PUT` [#](#_top)

**Open**: no

**Permissions**:
`Notes.:journal.edit`

**Parameters**:
```
param1: type [default]
param2: type
```
*Parameter Requirements*:

**Request Body**:
```
{
  Describe request body here
}
```

## Succesful responses
**Code**: `HTTP Response Code`

**Body**:

Body description
```
{
  json-body-example-goes-here
}
```

For multiple different succesful responses, add **Code** and **Body** fields here.

## Unsuccesful responses
**Code**: `HTTP Response Code`

**Cause**: Describe the cause of this error

**Body**:

Body description
```
{
  json-body-example-goes-here
}
```

## Notes
* List notes, preconditions, side effects regarding the use of this end-point

## <a name="DELETE"></a>`DELETE` [#](#_top)

**Open**: no

**Permissions**:
`Notes.:journal.delete`

**Parameters**:
```typescript
journal: string
id:      string
```

**Body**
```typescript
{
  eventDateTime:  string,
  versionText:    string,
  keywords:       string[] [[]],
}
```

## Succesful responses
**Code**: `HTTP Response Code`

**Body**:

Body description
```
{
  json-body-example-goes-here
}
```

For multiple different succesful responses, add **Code** and **Body** fields here.

## Unsuccesful responses
**Code**: `HTTP Response Code`

**Cause**: Describe the cause of this error

**Body**:

Body description
```
{
  json-body-example-goes-here
}
```

## Notes
* List notes, preconditions, side effects regarding the use of this end-point
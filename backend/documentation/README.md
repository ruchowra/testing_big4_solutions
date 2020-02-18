# Rätt Spår backend
The files herein describe the API for the Rätt Spår backend. It is structured path-wise to match the structure of the API endpoints,
that is to say the endpoint `/v4/api/core/notes/{journalid}` is found in the folder `v4-backend/documentation/api/core/notes.md`

Markdown is used to produce the documentation, and you should copy the template.md file where it needs to be, rename it and edit it as a means of documenting a new resource or endpoint.

The folder `documentation/internal` contains descriptions of the _internal API_, and its folder structure should mimick the structure of `src`. In the internals folder, the different interfaces and implementations of the system itself are documented, and the template-*.md files provide copy-pastable templates for documenting the different parts of the system.
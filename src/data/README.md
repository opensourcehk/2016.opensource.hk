Data directory
==============


Where do I work with the data in this folder?
---------------------------------------------

All JSON contents in this folder will be import through `gulp` to `swig`
templates. For example, contents in [sponsors.json][sponsor.json] will be
accessible in swig as `sponsors` and `data.sponsors`.


How do I maintain this folder
-----------------------------

You may just create any file in this folder and start working in `swig`
templates in the `src/pages` folder. You're recommended to fill in the
**Schema** section below to document your JSON strctures.


Schema
------

### topics.json

[topics.json](topics.json) contains an object with conference topics as
properties. The keys will be used to access the data.

Fields:

| Name              | Type       | Description
|--------------------------------------------
| `id`              | `string`   | Repeat the JSON key of this object (to be used much easier)
| `title`           | `string`   | Title of the topic
| `type`            | `string`   | Type of the topic (e.g. "talk", "keynote", "workshop", "unconference")
| `speaker`         | `string`   | The `id` of a speaker in [speakers.json](speakers.json).
| `category`        | `string`   | The single most relevant category name.
| `tags`            | `[]string` | Array of tag names.
| `level`           | `string`   | The `id` of a difficulty level.
| `requirement`     | `string`   | Description of requirement to audience.
| `target_audience` | `[]string` | Array of target audience type name (e.g "IT Managers").
| `short_desc`      | `string`   | Short description text of the topic.
| `description`     | `string`   | Long description text of the topic.
| `lang`            | `string`   | The `id` of [lang.json](lang.json).
| `lang_slide`      | `string`   | The `id` of [lang.json](lang.json).
| `length`          | `string`   | The `id` of [timeLengths.json](timeLengths.json).
| `licence_video`   | `string`   | The licence declared for the video.
| `licence_slide`   | `string`   | The licence declared for the slides.
| `isSponsorTopic`  | `bool`     | State if the topic is by sponsor.
| `venue`           | `string`   | The `id` of [venues.json](venues.json).
| `start`           | `string`   | String representation of date time (in ISO 8601).
| `end`             | `string`   | String representation of date time (in ISO 8601).


Example:

```JSON
{
  "id": "the-latest-innovation-mysql-document-store",
  "title": "The Latest Innovation -  MySQL Document Store",
  "type": "talk",
  "speaker": "kajiyama-ryusuke",
  "category": "Cloud",
  "tags": ["MySQL", "NewSQL"],
  "level": "intermediate",
  "requirement": "The audience should have basic coding skills.",
  "target_audience": ["Developers", "IT Managers"],
  "short_desc": "The MySQL Document Store is the latest innovation in MySQL, enabled by the JSON support in MySQL 5.7.",
  "description": [
    "<p>MySQL can now be used as a document store, combining the flexibility of ",
    "the document store model with the power of the relational model. Maybe ",
    "you already knew that we added a native JSON datatype, Virtual Columns ",
    "and Indexing, and many new JSON functions. But there’s now a lot more... ",
    "It is about the MySQL Document Store and what’s new across all levels of ",
    "the database stack – storage, structure, protocol, APIs, tools…etc.</p>",
    "<p>Whether you’re a developer, DBA or LOB owner, you’ll understand why ",
    "you’ll be able to choose MySQL for your Relational AND Document Store ",
    "needs, avoiding significant trade-offs and being forced into choosing ",
    "multiple solutions.</p>"
  ],
  "lang": "en",
  "lang_slide": "en",
  "length": "25min",
  "licence_video": "all-rights-reserved",
  "licence_slide": "all-rights-reserved",
  "isSponsorTopic": true,
  "venue": "big-hall",
  "start": "2016-06-24T14:25:00+0800",
  "end": "2016-06-24T14:50:00+0800"
}
```


### schedule.json

(TBD)


### speakers.json

(TBD)


### sponsors.json

(TBD)



### venues.json

(TBD)


import striptags from 'striptags';
import truncate from 'truncate';
import moment from 'moment';
import 'moment-range';

// extractSort returns a sorting function which extracts the a and b
// key to further do sorting
export function extractSort(extractorFn) {
  // returns a function to modify a sort() callback's parameters (a, b)
  // with the extractor function
  return (callback) => {
    // returns the wrapped callback
    return (a, b) => {
      // return the callback result
      return callback(extractorFn(a), extractorFn(b));
    }
  }
}

// multi compose several Array.prototype.sort() callback
// into a single one
export function multi(...callbacks) {
  return (a, b) => {
    for (let callback of callbacks) {
      var result = callback(a, b);
      if (result != 0) {
        return result
      }
    }
    return 0; // return 0 by default
  }
}

// byStart returns a sorting callback of the key "start"
// as a moment parsable timestamp, with the specified order
export function byStart(order = 'asc') {
  const factor = (order === 'desc') ? -1 : 1;
  return (a, b) => {
    const a_start = moment(a.start);
    const b_start = moment(b.start);
    const diff = a_start.diff(b_start);
    return factor * diff;
  }
}

export function byVenue(order = 'asc') {
  const factor = (order === 'desc') ? -1 : 1;
  return (a, b) => {
    const a_venue = String(a.venue === undefined ? "" : a.venue);
    const b_venue = String(b.venue === undefined ? "" : b.venue);
    const diff = a_venue.localeCompare(b_venue);
    return factor * diff;
  }
}

// findSponsor find a sponsor in the given sponsors array
function findSponsor(id, sponsors) {
  for (let tier of sponsors.sponsors) {
    for (let sponsor of tier.sponsors) {
      if (sponsor.id === id) {
        return Object.assign({}, sponsor);
      }
    }
  }
  return null;
}

const Days = {
  24: 'Day 1',
  25: 'Day 2',
  26: 'Day 3'
};

// dayName returns "Day 1", "Day 2" or "Day 3"
// according to the date of the given timeStr
function dayName(timeStr) {
  let day = formatTime(timeStr, 'DD');
  return day in Days ? Days[day] : null;
}

// formatTome parse input time string
// and properly reformat it to display
function formatTime(timeStr, formatStr='YYYY-MM-DD HH:mm zz') {
  return moment(timeStr).format(formatStr)
}

// findTopic finds the topic by props provided
// and display the topic summary
function findTopicSummary(data, placeholder, props) {
  var result = Object.entries(data.topics).find(([id, topic]) => {
    for (var prop in props) {
      if (topic[prop] != props[prop]) {
        return false;
      }
    }
    return true;
  });

  // if topic not found, show placeholder
  if (typeof result == "undefined") {
    return placeholder;
  }

  // show topic summary
  let [id, topic] = result;
  return topicSummary(data, id);
}

// topicSummary generates link (a tag) to topic
// for the schedule / agenda page
function topicSummary(data, id) {
  if (typeof data.topics[id] != "undefined") {
    var topic = data.topics[id];
    var timeLength = data.timeLengths[topic.length];
    var speaker = data.speakers[topic.speaker];
    var preReg = topic.pre_register ? `<span class="pre-register">(Pre-registration is required)</span>` : '';
    return `<a class="topic-summary" id="topic-summary-s-${id}" href="${topicURL("topic", id)}">`+
        `<span class="type">${capitalize(topic.type)}</span> ` +
        `<span class="title">${topic.title}</span> `+
        `<span class="speaker">${speaker.name}</span> `+
        `<span class="time">${timeLength.desc}</span> `+
        preReg +
      `</a>`;
  }
}

// topicURL generator
function topicURL (type, id) {
  if (type == 'topic') {
    return `/topics/${id}/`;
  }
}

// filterBy filters object (e.g. topic) by the given
// property name and value
function filterBy (name, value) {
  return function (obj) {
    return obj[name] === value;
  }
}

// turn an object into an array
function toArray (obj) {
  var arr = [];
  for ( var key in obj ) {
      arr.push(obj[key]);
  }
  return arr;
}

// strip tags from description text and return
function displayDescText(input, length=400) {
  if (Array.isArray(input)) {
    return displayDescText(input.join(' '));
  }
  return truncate(striptags(input), length);
}

// formatting (or not formatting) description strings
function displayDesc (input) {
  if (Array.isArray(input)) {
    return input.join(' ');
  }
  return input;
}

// capitalize string
function capitalize(type) {
  return type[0].toUpperCase() + type.slice(1);
}

export default {
  capitalize,
  dayName,
  displayDescText,
  displayDesc,
  filterBy,
  findSponsor,
  toArray,
  findTopicSummary,
  formatTime,
  multi,
  topicSummary,
  topicURL
};


import striptags from 'striptags';
import truncate from 'truncate';

// topicSummary generates link (a tag) to topic
// for the schedule / agenda page
function topicSummary(data, id) {
  if (typeof data.topics[id] != "undefined") {
    var topic = data.topics[id];
    return `<div class="topic-summary">`+
        `<span class="type">` + capitalize(topic.type) + `:</span> ` +
        `<a class="title" href="${topicURL("topic", id)}">${topic.title}</a> `+
        `<span class="time">(${data.timeLengths[topic.length].desc})</span>`+
      `</div>`;
  }
}

// topicURL generator
function topicURL (type, id) {
  if (type == 'topic') {
    return '/topics/' + id + '/';
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
  return arr
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
  "capitalize": capitalize,
  "displayDescText": displayDescText,
  "displayDesc": displayDesc,
  "filterBy": filterBy,
  "toArray": toArray,
  "topicSummary": topicSummary,
  "topicURL": topicURL
};

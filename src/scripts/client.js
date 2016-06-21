'use strict';

import navBar from "./utils/navBar";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import Store from "./apps/Programmes/Store";
import TicketButton from './apps/TicketButton';
import Programmes from "./apps/Programmes/Programmes";
import { extractSort, composeSort, byMoment, byString } from './utils/helperFuncs'

import langs       from "../data/langs";
import schedule    from "../data/schedule";
import speakers    from "../data/speakers";
import sponsors    from "../data/sponsors";
import timeLengths from "../data/timeLengths";
import topics      from "../data/topics";
import venues      from "../data/venues";


navBar();


let ticketDiv = document.getElementById('ticket');
if ((typeof ticketDiv !== "undefined") && (ticketDiv !== null)) {
  render((
      <TicketButton
        className="btn btn-lg btn-hkosc button-front-mobile-ticket"
        target="_blank"
        href="https://hkoscon2016.eventbrite.com/?aff=website" />
    ),
    ticketDiv
  );
}

// translate data into array that's suitable for
// store to filter
function topicStoreAll(data = {topics: {}}) {
  let all = [];
  for (let id in data.topics) {
    let topic = topics[id];
    all.push({
      topic,
      category: [topic.category],
      target_audience: topic.target_audience,
      level: topic.level
    });
  }
  return all;
}

// mapStoreData maps data to store object
// with the help of the mapAll function
// to translate `topics` to `all`
function mapStoreData(mapAll, data) {

  // helps to extract attributes inside variables
  // for sorting
  const extractor = (item) => {
    return item.topic || {};
  };

  // sort all items in data by its
  // .topic.start and .topic.venue values
  const all = mapAll(data).sort(
    extractSort(extractor)(composeSort(
      byMoment('start', 'desc'),
      byString('venue')
    ))
  );

  return {
    data,
    all,
    filters: {},
    attributes: {
      filterShow: false
    },
    display: all
  };
}

// map all useful data to store as `data`
const store = Store(mapStoreData(topicStoreAll, {
  langs,
  schedule,
  speakers,
  sponsors,
  topics,
  timeLengths,
  venues
}));

const timetableDiv = document.getElementById('timetable');
if ((typeof timetableDiv !== "undefined") && (timetableDiv !== null)) {
  render((
      <Provider store={store}>
        <Programmes/>
      </Provider>
    ),
    timetableDiv
  );
}

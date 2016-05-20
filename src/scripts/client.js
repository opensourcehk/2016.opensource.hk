'use strict';

import navBar from "./utils/navBar";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import Store from "./apps/Programmes/Store";
import TicketButton from './apps/TicketButton';
import Programmes from "./apps/Programmes/Programmes";

import speakers from "../data/speakers.json";
import topics   from "../data/topics.json";
import langs    from "../data/langs.json";

navBar();

var store = Store({
  speakers: speakers,
  topics: topics,
  langs: langs,

  // TODO: render speakers, topics information into a list of programmes to be
  // displayed in timetable ("all")
  all: [],

  filtered: topics
});

let ticketDiv = document.getElementById('ticket');
if ((typeof ticketDiv != "undefined") && (ticketDiv != null)) {
  render(<TicketButton className="btn btn-lg btn-hkosc button-front-mobile-ticket" />,
    ticketDiv);
}

let timetableDiv = document.getElementById('timetable');
if ((typeof timetableDiv != "undefined") && (timetableDiv != null)) {
  console.log("run here");
  render((
      <Provider store={store}>
        <Programmes/>
      </Provider>
    ),
    timetableDiv
  );
}

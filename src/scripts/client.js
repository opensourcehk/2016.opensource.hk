'use strict';

import navBar from "./utils/navBar";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import Store from "./apps/Programmes/Store";
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

render((
    <Provider store={store}>
      <Programmes store={store}/>
    </Provider>
  ),
  document.getElementById('timetable')
);

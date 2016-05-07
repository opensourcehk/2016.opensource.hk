'use strict';

import React from "react";
import ReactDOM from "react-dom";
import navBar from "./utils/navBar";
import TimeTable from "./components/TimeTable";

import speakers from "../data/speakers.json";
import topics   from "../data/topics.json";
import langs    from "../data/langs.json";

navBar();

function hello() {
  return (
    <TimeTable speakers={speakers} topics={topics} langs={langs} />
  )
}

ReactDOM.render(hello(), document.getElementById('playground'));

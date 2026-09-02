import * as core from './core';

const { Rosie: helpers, ...api } = core;

Object.assign(window, { Rosie: { ...helpers, ...api } });

core.initPlugins();

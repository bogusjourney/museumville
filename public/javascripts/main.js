if (_ !== "undefined") {
  // convert templated tags from <%= name %> to {{ name }}
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
  };
}


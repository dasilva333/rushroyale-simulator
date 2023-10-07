import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Sentry extends BaseUnit {
  static defaultImage = "sentry.png";

  constructor(config) {
    super({
      name: "Sentry",
      ...config
    });
    this.component = SentryComponent;
  }

  // Additional methods specific to the Sentry unit here
}

function SentryComponent(props) {
  return (
    <div className="unit Sentry">
      <img src={Sentry.baseImage} width="70" alt="Sentry Unit" />
    </div>
  );
}

export { Sentry, SentryComponent };
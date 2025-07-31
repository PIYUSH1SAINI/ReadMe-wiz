import React from "react";

type Props = { name: string };

function Welcome({ name }: Props) {
  return <h1>Hello {name}</h1>;
}

export default Welcome;

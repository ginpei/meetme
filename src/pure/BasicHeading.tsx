/* eslint-disable jsx-a11y/heading-has-content */

import React, { ElementType, FC } from 'react';

export type HtmlProps<T extends ElementType> =
  React.ComponentPropsWithRef<T>;

type Prop = HtmlProps<'h1'>;

type MasterProp = Prop & {
  level: 1 | 2 | 3;
}

const BasicHeading: FC<MasterProp> = (props) => {
  const { level, ...headingProps } = props;

  if (!headingProps.children) {
    throw new Error('Headings must have content and the content must be accessible by a screen reader.');
  }

  if (level === 1) {
    return (
      <h1 {...headingProps} />
    );
  } else if (level === 2) {
    return (
      <h2 {...headingProps} />
    );
  } else if (level === 3) {
    return (
      <h3 {...headingProps} />
    );
  } else {
    throw new Error('Never');
  }
};

export const BasicHeading1: FC<Prop> = (props) => (
  <BasicHeading level={1} {...props} />
);

export const BasicHeading2: FC<Prop> = (props) => (
  <BasicHeading level={2} {...props} />
);

export const BasicHeading3: FC<Prop> = (props) => (
  <BasicHeading level={3} {...props} />
);

export default BasicHeading;

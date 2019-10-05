import React, { FC } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const BasicHeaderOuter = styled.div`
  background-color: var(--color-theme-bg);
  color: var(--color-theme-fg);
  font-size: 0.8rem;
  line-height: 1.8em;

  & a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;


const BasicBody = styled.div.attrs({
  className: 'ui-container',
})`
  min-height: 50vh;
`;

const BasicFooter = styled.div`
  border-top: dashed 1px #ccc;
  font-size: 0.8rem;
  margin-top: 1rem;
  padding-bottom: 1rem;
  padding-top: 1rem;
`;

type Prop = React.ComponentPropsWithRef<'div'>;

const BasicLayout: FC<Prop> = (props) => {
  return (
    <div {...props} className={`BasicLayout ${props.className}`}>
      <BasicHeaderOuter>
        <div className="ui-container">
          <Link to="/" aria-label="Home">Meet Me</Link>
        </div>
      </BasicHeaderOuter>
      <BasicBody>
        {props.children}
      </BasicBody>
      <BasicFooter>
        <div className="ui-container">
          {'By '}
          <a href="https://ginpei.dev">Ginpei Takanashi</a>
        </div>
      </BasicFooter>
    </div>
  );
};

export default BasicLayout;
